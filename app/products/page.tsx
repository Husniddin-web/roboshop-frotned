"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import ProductCard from "@/components/ProductCard";
import { useAdminProducts, useCategory } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  X,
  Filter,
  PackageSearch,
  LayoutGrid,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
} from "lucide-react";
import {
  FilterSkeleton,
  MobileFilterSkeleton,
  ProductGridSkeleton,
} from "../../components/skelton";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function ProductsPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data: productsData, isLoading } = useAdminProducts({
    search,
    category,
    page: currentPage,
  });

  const { data: categories = [], isLoading: categoryLoading } = useCategory();
  const { i18n, t } = useTranslation();
  const isUz = i18n.language === "uz";

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [i18n.language, queryClient]);

  const products = productsData?.data || [];
  const totalPages = productsData?.meta?.lastPage || 1;
  const totalProducts = productsData?.meta?.total || 0;

  const formatCategoryName = (name?: string) => {
    if (!name) return "Unnamed";
    return name.charAt(0).toLocaleUpperCase(i18n.language) + name.slice(1);
  };

  const activeCategoryObj = categories.find((c: any) => String(c.id) === String(category));
  const activeCategoryName = activeCategoryObj
    ? formatCategoryName(activeCategoryObj.translations?.[0]?.name)
    : "";

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    router.push(`/products?${newParams.toString()}`);
  };

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set("category", catId);
    } else {
      newParams.delete("category");
    }
    newParams.delete("search");
    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    router.push("/products");
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="main-electronics-bg min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <main className="container px-4 pt-24 md:pt-28 pb-16 relative z-10">
          {/* Top Banner / Mobile Filter Toggle */}
          <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-amber-400 font-semibold text-sm transition-all"
            >
              <SlidersHorizontal size={16} />
              <span>{t("filters")}</span>
              {category && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {(search || category) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
              >
                {t("clear.filters") || "Filtrni tozalash"}
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- DESKTOP SIDEBAR WITH ICONS --- */}
            <div className="w-full lg:w-72 lg:flex-shrink-0">
              <aside className="hidden lg:block sticky top-24">
                <div className="glass-panel rounded-2xl border border-white/10 p-5 shadow-xl">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                      <SlidersHorizontal size={16} className="text-amber-400" />
                      <span>{t("categories")}</span>
                    </div>
                    {category && (
                      <button
                        onClick={clearAllFilters}
                        className="text-[11px] text-amber-400/80 hover:text-amber-300 transition-colors"
                      >
                        {isUz ? "Tozalash" : "Сбросить"}
                      </button>
                    )}
                  </div>

                  {categoryLoading ? (
                    <FilterSkeleton />
                  ) : (
                    <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                      {/* All Categories Option */}
                      <button
                        onClick={() => handleCategoryChange("")}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          !category
                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/20"
                            : "text-zinc-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutGrid
                            size={16}
                            className={!category ? "text-black" : "text-amber-400"}
                          />
                          <span>{t("all.categories")}</span>
                        </div>
                        {!category && <ChevronRight size={14} className="text-black" />}
                      </button>

                      {/* Dynamic Categories with Icons */}
                      {categories.map((cat: any) => {
                        const isCatActive = String(category) === String(cat.id);
                        const rawName = cat?.translations?.[0]?.name || "";
                        const formattedName = formatCategoryName(rawName);
                        const icon = getCategoryIcon(rawName);

                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 text-left ${
                              isCatActive
                                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                                : "text-zinc-300 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className={isCatActive ? "text-black [&>svg]:text-black" : ""}>
                                {icon}
                              </span>
                              <span className="truncate">{formattedName}</span>
                            </div>

                            {isCatActive && (
                              <ChevronRight size={14} className="text-black flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </aside>

              {/* --- MOBILE FILTER DRAWER --- */}
              {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex">
                  <div className="relative w-4/5 max-w-sm h-full bg-[#0b0f17] border-r border-white/10 p-6 overflow-y-auto flex flex-col justify-between">
                    <div>
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2 font-bold text-white text-base">
                          <SlidersHorizontal size={18} className="text-amber-400" />
                          <span>{t("categories")}</span>
                        </div>
                        <button
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Mobile Category List */}
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCategoryChange("")}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            !category
                              ? "bg-amber-400 text-black font-bold"
                              : "text-zinc-300 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LayoutGrid
                              size={17}
                              className={!category ? "text-black" : "text-amber-400"}
                            />
                            <span>{t("all.categories")}</span>
                          </div>
                          {!category && <ChevronRight size={15} />}
                        </button>

                        {categories.map((cat: any) => {
                          const isCatActive = String(category) === String(cat.id);
                          const rawName = cat?.translations?.[0]?.name || "";
                          const formattedName = formatCategoryName(rawName);
                          const icon = getCategoryIcon(rawName);

                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryChange(cat.id)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                                isCatActive
                                  ? "bg-amber-400 text-black font-bold"
                                  : "text-zinc-300 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <span className={isCatActive ? "text-black [&>svg]:text-black" : ""}>
                                  {icon}
                                </span>
                                <span className="truncate">{formattedName}</span>
                              </div>
                              {isCatActive && <ChevronRight size={15} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Clear / Close Button */}
                    <div className="pt-6 border-t border-white/10">
                      <button
                        onClick={clearAllFilters}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-amber-400 font-bold text-sm hover:bg-white/10 transition-colors"
                      >
                        {t("clear.filters") || "Filtrlarni tozalash"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- PRODUCTS GRID & CONTROLS --- */}
            <div className="flex-1 min-w-0 w-full">
              {/* Active Filter Status & Title Bar */}
              <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {search
                        ? `${t("search.results.for")} "${search}"`
                        : activeCategoryName
                        ? activeCategoryName
                        : t("all.products")}
                    </h1>
                  </div>

                  {!isLoading && (
                    <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>
                        {totalProducts} {t("products.found") || "ta mahsulot topildi"}
                      </span>
                    </p>
                  )}
                </div>

                {(search || category) && !isLoading && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-400 transition-colors"
                    >
                      <X size={14} />
                      <span>{isUz ? "Filtrni bekor qilish" : "Сбросить фильтр"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Grid Content */}
              {isLoading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 px-6 border border-white/10 rounded-2xl glass-panel text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
                    <PackageSearch size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {t("no.products.found")}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mb-6">
                    {isUz
                      ? "Kiritilgan so'rov bo'yicha hech qanday tovar topilmadi. Boshqa kalit so'z bilan qidirib ko'ring yoki barcha mahsulotlarga o'ting."
                      : "По вашему запросу товары не найдены. Попробуйте изменить параметры поиска."}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="btn btn-primary px-6 py-2.5 text-xs font-bold"
                  >
                    {t("all.products")}
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 sm:mt-14 px-2">
                  <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl glass-panel border border-white/10 shadow-xl max-w-full overflow-x-auto">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="h-8 sm:h-9 px-2 sm:px-3.5 flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex-shrink-0"
                    >
                      <ChevronLeft size={15} />
                      <span className="hidden sm:inline">{t("previous")}</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 5) {
                          if (currentPage <= 3) page = i + 1;
                          else if (currentPage >= totalPages - 2)
                            page = totalPages - 4 + i;
                          else page = currentPage - 2 + i;
                        }
                        const isActive = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center ${
                              isActive
                                ? "bg-amber-400 text-black shadow-md shadow-amber-500/25 scale-105"
                                : "bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="h-8 sm:h-9 px-2 sm:px-3.5 flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex-shrink-0"
                    >
                      <span className="hidden sm:inline">{t("next")}</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <Cart />
    </div>
  );
}

