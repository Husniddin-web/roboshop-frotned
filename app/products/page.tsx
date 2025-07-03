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
import { X, Filter } from "lucide-react";
import {
  FilterSkeleton,
  MobileFilterSkeleton,
  ProductGridSkeleton,
} from "../../components/skelton";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const { data: productsData, isLoading } = useAdminProducts(search, category);
  const { data: categories = [], isLoading: categoryLoading } = useCategory();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [i18n.language]);

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set("category", cat);
    } else {
      newParams.delete("category");
    }
    router.push(`/products?${newParams.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
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
        <div className="mb-10">
          <Header />
        </div>
        <main className="container px-4 py-6 relative ">
          <div className="flex flex-col lg:flex-row gap-6">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-yellow-400 border border-yellow-400/40 px-3 py-2 rounded mb-8 transition-all duration-200 hover:bg-yellow-400/10"
            >
              <Filter size={18} />
              {t("filters")}
            </button>

            <div className="lg:w-64 lg:flex-shrink-0">
              <aside className="hidden lg:block lg:fixed lg:top-24 lg:w-64 lg:h-[calc(75vh-6rem)] no-scrollbar">
                {categoryLoading ? (
                  <FilterSkeleton />
                ) : (
                  <div
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    className="bg-gray-800 p-4 rounded-lg border border-yellow-400/30 h-full overflow-y-scroll transition-all duration-300"
                  >
                    <h2 className="text-lg font-bold text-yellow-400 mb-4">
                      {t("filters")}
                    </h2>
                    <ul className="space-y-2">
                      <li
                        onClick={() => handleCategoryChange("")}
                        className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          !selectedCategory
                            ? "bg-yellow-400 text-black font-semibold"
                            : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                        }`}
                      >
                        {t("all.categories")}
                      </li>
                      {categories.map((category: any) => (
                        <li
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            selectedCategory === category.id
                              ? "bg-yellow-400 text-black font-semibold"
                              : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                          }`}
                        >
                          {category?.translations?.[0]?.name || "Unnamed"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>

              {isMobileFilterOpen && (
                <>
                  {categoryLoading ? (
                    <MobileFilterSkeleton />
                  ) : (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:hidden">
                      <div className="absolute left-0 top-0 h-full w-72 bg-gray-900 border-r border-yellow-500 p-4 overflow-y-auto transition-transform duration-300 ease-out">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-yellow-400">
                            {t("filters")}
                          </h2>
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
                              !selectedCategory
                                ? "bg-yellow-400 text-black font-semibold"
                                : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                            }`}
                          >
                            {t("all.categories")}
                          </li>
                          {categories.map((category: any) => (
                            <li
                              key={category.id}
                              onClick={() => handleCategoryChange(category.id)}
                              className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                selectedCategory === category.id
                                  ? "bg-yellow-400 text-black font-semibold"
                                  : "text-yellow-100 hover:text-yellow-300 hover:bg-yellow-400/10"
                              }`}
                            >
                              {category?.translations?.[0]?.name || "Unnamed"}
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

            {/* Products Section */}
            <div className="flex-1 min-w-0 lg:ml-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-yellow-400 mb-1">
                    {search
                      ? `${t("search.results.for")} "${search}"`
                      : t("all.products")}
                  </h1>
                  {!isLoading && (
                    <p className="text-yellow-200 text-sm">
                      {products.length} {t("products.found")}
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
                <ProductGridSkeleton count={4} />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-yellow-300">
                  <p>{t("no.products.found")}</p>
                </div>
              )}

              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                        onClick={() => setCurrentPage(page)}
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
