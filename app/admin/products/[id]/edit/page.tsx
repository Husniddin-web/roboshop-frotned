import ProductPageForm from "../../../../../components/admin/ProductPageForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductPageForm productId={id} />;
}

