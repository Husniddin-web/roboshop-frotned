"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  useAdminProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "@/lib/api";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { useDispatch } from "react-redux";
import { logout } from "../../lib/features/authSlice";
import { removeAccessToken } from "../../lib/cookies";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ProductForm from "./ProductForm";

export default function ProductsManager({ search }: { search: string }) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: productsData = {}, isLoading } = useAdminProducts(search);
  const allProducts = productsData?.data || [];
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const paginatedProducts = allProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    if (confirm(t("delete.confirm"))) {
      const toastId = showToast.loading(t("deleting.product"));
      try {
        const res = await deleteProductMutation.mutateAsync(id);
        if (res.status === 200) {
          showToast.update(
            toastId,
            "success",
            t("product.deleted.successfully")
          );
        } else {
          dispatch(logout());
          removeAccessToken();
          showToast.update(toastId, "error", t("admin.relogin"));
        }
      } catch {
        dispatch(logout());
        removeAccessToken();
        showToast.update(toastId, "error", t("delete.failed"));
      }
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
          border: "2px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          className="loading mx-auto"
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.2)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p
          className="mt-4 text-sm font-medium"
          style={{ color: "#ffffff", fontFamily: '"Courier New", monospace' }}
        >
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
        border: "2px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#ffffff",
            fontFamily: '"Courier New", monospace',
            textTransform: "uppercase",
          }}
        >
          {t("products.management")}
        </h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-white to-neutral-200 text-black font-mono font-bold uppercase transition-transform duration-200 hover:scale-105 active:scale-95"
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
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
                    className="p-4 text-left font-semibold border-b"
                    style={{
                      color: "#ffffff",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      fontFamily: '"Courier New", monospace',
                      textTransform: "uppercase",
                    }}
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
                  className="border-b transition-colors duration-200"
                  style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                >
                  <td className="p-4">
                    <div className="flex gap-2">
                      {product.images
                        ?.slice(0, 3)
                        .map((img: any, idx: number) => (
                          <motion.img
                            key={idx}
                            src={
                              `${BASE_URL}/uploads/${img.url}` ||
                              "/placeholder.svg"
                            }
                            className="w-12 h-12 object-cover rounded-md"
                            style={{
                              border: "2px solid rgba(255, 255, 255, 0.1)",
                            }}
                            alt={`Product ${idx + 1}`}
                            whileHover={{ scale: 1.1 }}
                          />
                        ))}
                      {product.images?.length > 3 && (
                        <div
                          className="w-12 h-12 flex items-center justify-center text-xs rounded-md font-medium"
                          style={{
                            color: "#ffffff",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "2px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          +{product.images.length - 3}
                        </div>
                      )}
                      {!product.images?.length && (
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "2px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <FiImage style={{ color: "#ffffff" }} size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-white font-mono">
                    {product.translations[0]?.name || "Unnamed"}
                  </td>
                  <td className="p-4 text-white font-mono font-semibold">
                    {Number(product.price).toFixed(2)} SUM
                  </td>
                  <td className="p-4 text-gray-400 font-mono">
                    {product.category?.translations?.find(
                      (t: any) => t.languageId === i18n.language
                    )?.name ||
                      product.category?.translations?.[0]?.name ||
                      "No Category"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
                        product.isActive
                          ? "bg-green-500 text-black border border-green-400"
                          : "bg-gray-700 text-white border border-gray-600"
                      }`}
                      style={{
                        fontFamily: '"Courier New", monospace',
                        textTransform: "uppercase",
                      }}
                    >
                      {product.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          setEditingProduct(product.id);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-md"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#ffffff",
                        }}
                        title={t("edit")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiEdit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-md"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#ef4444",
                        }}
                        title={t("delete")}
                        whileHover={{ scale: 1.1 }}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded border text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 font-mono"
          >
            {t("previous")}
          </button>
          <span className="text-white font-mono text-sm">
            {t("page")} {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded border text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 font-mono"
          >
            {t("next")}
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm
          productId={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </motion.div>
  );
}
