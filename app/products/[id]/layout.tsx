import type React from "react";
import type { Metadata } from "next";

const SITE_URL = "https://roboshop.uz";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/product/${id}`, {
      headers: { lang: "uz" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

function shortText(text: string, max = 160) {
  const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  const t = product?.translations?.[0];
  if (!t?.name) return { title: "Mahsulot", alternates: { canonical: `/products/${id}` } };

  const price = Number(product.price);
  const priceText = price ? ` Narxi: ${price.toLocaleString("ru-RU")} so'm.` : "";
  const description = shortText(
    (t.description ? `${t.description} ` : `${t.name} — RoboShop do'konida.`) + priceText
  );
  const image = product.images?.[0]?.url;

  return {
    title: t.name,
    description,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products/${id}`,
      title: `${t.name} | Arduino Shop`,
      description,
      images: image ? [{ url: image, alt: t.name }] : undefined,
    },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  const t = product?.translations?.[0];

  const jsonLd =
    t?.name && Number(product.price)
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: t.name,
          description: t.description ? shortText(t.description, 500) : undefined,
          image: (product.images || []).map((img: { url: string }) => img.url),
          brand: { "@type": "Brand", name: "RoboShop" },
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/products/${id}`,
            priceCurrency: "UZS",
            price: Number(product.price),
            availability:
              product.isActive === false
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          },
        }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
