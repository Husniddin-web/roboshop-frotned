"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCategoryPreviews } from "@/lib/api";
import ProductCard from "./ProductCard";
import { ArrowRight, Flame } from "lucide-react";

export function FeaturedProducts() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isUz = i18n.language === "uz";

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category_previews"] });
  }, [i18n.language, queryClient]);

  const { data: previewsData, isLoading } = useCategoryPreviews();

  const featuredProducts =
    previewsData?.flatMap((category: any) => category.products) || [];

  return (
    <section className="py-14 relative">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
              <Flame size={14} className="text-amber-400" />
              <span>{isUz ? "Top Tanlov" : "Топ Выбор"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t("featured.products")}
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-all duration-200 group"
          >
            <span>{t("view.all")}</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading state skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl p-4 aspect-[3/4] animate-pulse flex flex-col justify-between"
              >
                <div className="bg-white/5 rounded-xl h-40 w-full mb-3" />
                <div className="space-y-2">
                  <div className="bg-white/10 h-4 rounded w-3/4" />
                  <div className="bg-white/5 h-3 rounded w-1/2" />
                  <div className="bg-white/10 h-6 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

