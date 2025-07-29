// components/FeaturedProducts.tsx - REFACTORED

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCategoryPreviews } from "@/lib/api"; // <-- USE THE NEW HOOK
import ProductCard from "./ProductCard";

export function FeaturedProducts() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category_previews"] });
  }, [i18n.language, queryClient]);

  const { data: previewsData, isLoading } = useCategoryPreviews(); // <-- USE THE NEW HOOK

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container text-center">
          <p className="mt-4" style={{ color: "#d4d4aa" }}>
            {t("loading.products")}
          </p>
        </div>
      </section>
    );
  }

  const featuredProducts =
    previewsData?.flatMap((category: any) => category.products) || [];

  return (
    <section className="py-4 sm:py-6 md:py-8">
      <div className="container px-2 sm:px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <h2
            className="text-base sm:[13px] md:[13px] font-bold"
            style={{
              color: "#facc15",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("featured.products")}
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 text-xs sm:text-sm md:text-base font-medium rounded-md sm:rounded-lg border border-yellow-400 bg-transparent text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200 min-h-[28px] sm:min-h-[32px] md:min-h-[36px] whitespace-nowrap"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span className="truncate">{t("view.all")}</span>
            <svg
              className="ml-1 sm:ml-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
