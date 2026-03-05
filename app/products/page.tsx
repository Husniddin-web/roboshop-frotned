// ProductsPage.tsx - FULL UPDATED CODE
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
import { X, Filter, PackageSearch } from "lucide-react";
import {
  FilterSkeleton,
  MobileFilterSkeleton,
  ProductGridSkeleton,
} from "../../components/skelton";

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
  console.log(productsData);
  const { data: categories = [], isLoading: categoryLoading } = useCategory();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [i18n.language]);

  const products = productsData?.data || [];
  const totalPages = productsData?.meta?.lastPage || 1;
  const totalProducts = productsData?.meta?.total || 0;

  const formatCategoryName = (name?: string) => {
    if (!name) return "Unnamed";
    return name.charAt(0).toLocaleUpperCase(i18n.language) + name.slice(1);
  };

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
    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    router.push("/products");
    setIsMobileFilterOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        minHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Header />
        <main className="container px-4 pt-24 md:pt-28 pb-8 relative">
          <div className="flex flex-col lg:flex-row gap-6">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-yellow-400 border border-yellow-400/40 px-3 py-2 rounded mb-8 transition-all duration-200 hover:bg-yellow-400/10"
            >
              <Filter size={18} />
              {t("filters")}
            </button>

            {/* --- FILTER SECTION (Desktop) --- */}
            <div className="lg:w-64 lg:flex-shrink-0">
              <aside className="hidden lg:block sticky top-24 no-scrollbar">
                {categoryLoading ? (
                  <FilterSkeleton />
                ) : (
                  <div
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className="bg-gray-800 p-4 rounded-lg border border-yellow-400/30 min-h-[320px] max-h-[calc(100vh-8rem)] overflow-y-auto transition-all duration-300"
                  >
                    <ul className="space-y-2">
                      <li
                        onClick={() => handleCategoryChange("")}
                        className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          !category
                            ? "bg-yellow-400 text-black font-semibold"
                            : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                        }`}
                      >
                        {t("all.categories")}
                      </li>
                      {categories.map((cat: any) => (
                        <li
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.id)}
                          className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            category === cat.id
                              ? "bg-yellow-400 text-black font-semibold"
                              : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                          }`}
                        >
                          {formatCategoryName(cat?.translations?.[0]?.name)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>

              {/* --- FILTER SECTION (Mobile) --- */}
              {isMobileFilterOpen && (
                <>
                  {categoryLoading ? (
                    <MobileFilterSkeleton />
                  ) : (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:hidden">
                      <div className="absolute left-0 top-0 h-full w-72 bg-gray-900 border-r border-yellow-500 p-4 overflow-y-auto transition-transform duration-300 ease-out">
                        <div className="flex justify-end items-center mb-4">
                          <button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="text-yellow-400 hover:text-yellow-200 transition-colors duration-200"
                          >
                            <X />
                          </button>
                        </div>
                        <ul className="space-y-2">
                          <li
                            onClick={() => handleCategoryChange("")}
                            className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                              !category
                                ? "bg-yellow-400 text-black font-semibold"
                                : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                            }`}
                          >
                            {t("all.categories")}
                          </li>
                          {categories.map((cat: any) => (
                            <li
                              key={cat.id}
                              onClick={() => handleCategoryChange(cat.id)}
                              className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                category === cat.id
                                  ? "bg-yellow-400 text-black font-semibold"
                                  : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                              }`}
                            >
                              {formatCategoryName(cat?.translations?.[0]?.name)}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={clearAllFilters}
                          className="mt-6 w-full px-4 py-2 text-sm bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-all duration-200"
                        >
                          {t("clear.filters")}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* --- PRODUCTS GRID & PAGINATION --- */}
            <div className="flex-1 min-w-0 lg:ml-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-1 md:mt-2">
                <div>
                  <h1 className="text-2xl font-bold text-yellow-400 mb-1">
                    {search
                      ? `${t("search.results.for")} "${search}"`
                      : t("all.products")}
                  </h1>
                  {!isLoading && (
                    <p className="text-yellow-200 text-sm">
                      {totalProducts} {t("products.found")}
                    </p>
                  )}
                </div>
                {(search || category) && !isLoading && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-sm bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-all duration-200"
                  >
                    {t("clear.filters")}
                  </button>
                )}
              </div>

              {isLoading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-14 px-4 border border-yellow-400/20 rounded-xl bg-yellow-400/5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <PackageSearch className="w-14 h-14 text-yellow-400 mb-3" />
                    <p className="text-yellow-300 text-lg font-semibold">
                      {t("no.products.found")}
                    </p>
                  </div>
                </div>
              )}

              {/* --- PAGINATION CONTROLS (Updated Logic) --- */}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm bg-gray-800 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {t("previous")}
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2)
                        page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-yellow-400 text-black font-semibold"
                            : "bg-gray-800 border border-yellow-400/30 text-yellow-400 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm bg-gray-800 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {t("next")}
                  </button>
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
