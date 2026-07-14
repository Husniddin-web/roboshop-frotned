"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  useAdminProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "@/lib/api";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { useDispatch } from "react-redux";
import { logout } from "../../lib/features/authSlice";
import { removeAccessToken } from "../../lib/cookies";
import { useTranslation } from "react-i18next";
import { motion } from "@/lib/no-motion";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";

export default function ProductsManager({ search }: { search: string }) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 10;

  // --- 1. UPDATED DATA FETCHING ---
  // Pass the current page and item limit directly to the hook.
  // React Query will automatically refetch when `page` or `search` changes.
  const { data: productsData, isLoading } = useAdminProducts({
    search,
    page,
    limit: itemsPerPage,
  });

  // --- 2. USE SERVER-SIDE PAGINATION DATA ---
  // The data from the API is already paginated, so no more .slice() needed.
  const paginatedProducts = productsData?.data || [];
  // Get total pages from the API's metadata.
  const totalPages = productsData?.meta?.lastPage || 1;

  const deleteProductMutation = useDeleteProduct();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const toastId = showToast.loading(t("deleting.product"));
    try {
      const res = await deleteProductMutation.mutateAsync(deletingId);
      if (res.status === 200) {
        showToast.update(toastId, "success", t("product.deleted.successfully"));
      } else {
        dispatch(logout());
        removeAccessToken();
        showToast.update(toastId, "error", t("admin.relogin"));
      }
    } catch {
      dispatch(logout());
      removeAccessToken();
      showToast.update(toastId, "error", t("delete.failed"));
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (isLoading) {
    return (
      <div
        className="text-center py-12 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        }}
      >
        <p className="mt-4 text-sm font-medium text-white">
          {t("loading.products")}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-lg p-6 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-bold text-white uppercase"
          style={{ fontFamily: '"Courier New", monospace' }}
        >
          {t("products.management")}
        </h2>
        <button
          onClick={() => router.push("/admin/products/create")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold uppercase transition-transform duration-200 hover:scale-105"
        >
          <FiPlus size={18} />
          {t("add.product")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
          }}
        >
          <table className="w-full border-collapse">
            <thead
              style={{
                background: "linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)",
              }}
            >
              <tr>
                {[
                  "images",
                  "name",
                  "price",
                  "category",
                  "status",
                  "actions",
                ].map((key) => (
                  <th
                    key={key}
                    className="p-4 text-left font-semibold border-b border-neutral-700 text-white uppercase"
                    style={{ fontFamily: '"Courier New", monospace' }}
                  >
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product: any, index: number) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-neutral-800 transition-colors duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                >
                  <td className="p-4">
                    {
                      <motion.img
                        src={
                          product?.images?.[0]?.url
                            ? `${BASE_URL}/uploads/${product.images[0].url}`
                            : "./placeholder.svg"
                        }
                        className="w-12 h-12 object-cover rounded-md"
                        style={{
                          border: "2px solid rgba(255, 255, 255, 0.1)",
                        }}
                        alt="product image"
                        whileHover={{ scale: 1.1 }}
                      />
                    }
                  </td>
                  <td className="p-4 text-white font-mono">
                    {product.translations[0]?.name || "Unnamed"}
                  </td>
                  <td className="p-4 text-white font-mono font-semibold">
                    {Number(product.price).toFixed(2)} UZS
                  </td>
                  <td className="p-4 text-gray-400 font-mono">
                    {product.category?.translations?.[0]?.name || "No Category"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? "bg-green-500 text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {product.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="p-2 rounded-md bg-white/5 text-white border border-white/10"
                        title={t("edit")}
                        whileHover={{ scale: 1.1, backgroundColor: "#555" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiEdit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(product.id)}
                        className="p-2 rounded-md bg-red-900/50 text-red-400"
                        title={t("delete")}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "#ef4444",
                          color: "#fff",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - NO CHANGE NEEDED HERE */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded border border-neutral-600 text-white bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 font-mono"
          >
            {t("previous")}
          </button>
          <span className="text-white font-mono text-sm">
            {t("page")} {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded border border-neutral-600 text-white bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 font-mono"
          >
            {t("next")}
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={t("delete.confirm")}
        message="Mahsulot o'chirilishi bilan bog'liq barcha ma'lumotlar ham o'chiriladi. Bu amal qaytarilmaydi!"
        confirmText={t("delete")}
        cancelText="Bekor qilish"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteConfirm(false); setDeletingId(null); }}
        loading={deleteProductMutation.isPending}
        danger
      />
    </motion.div>
  );
}
