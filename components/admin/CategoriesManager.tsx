"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import {
  useCategoryForAdmin,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../lib/api";
import { getInitilizeCategoryFormData } from "../../lib/getInitilizeFormData";
import { useDispatch } from "react-redux";
import { logout } from "../../lib/features/authSlice";
import { removeAccessToken } from "../../lib/cookies";
import { useTranslation } from "react-i18next";
import { motion } from "@/lib/no-motion";
import ConfirmDialog from "./ConfirmDialog";

export default function CategoriesManager({ search }: { search: string }) {
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const limit = 10;

  const { t } = useTranslation();

  const { data: categoryData } = useCategoryForAdmin(search, page, limit);
  const categories: any[] = categoryData?.data || [];
  const totalPages = categoryData?.meta?.lastPage || 1;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const deleteToastId = showToast.loading(t("deleting.category"));
    try {
      const res = await deleteCategory({ id: deletingId });
      if (res?.status == 200) {
        showToast.update(deleteToastId, "success", t("category.deleted.successfully"));
      } else {
        dispatch(logout());
        removeAccessToken();
        showToast.update(deleteToastId, "error", t("delete.failed"));
      }
    } catch (error) {
      showToast.update(deleteToastId, "error", t("delete.failed"));
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

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
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {t("categories.management")}
        </h2>
        <motion.button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
            color: "#000000",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          whileHover={{
            scale: 1.05,
            background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
            color: "#ffffff",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus size={16} />
          {t("add.category")}
        </motion.button>
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
                <th
                  className="p-4 text-left font-semibold border-b"
                  style={{
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Name (UZ)
                </th>
                <th
                  className="p-4 text-left font-semibold border-b"
                  style={{
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Name (RU)
                </th>
                <th
                  className="p-4 text-left font-semibold border-b"
                  style={{
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500 font-mono">
                    Kategoriyalar topilmadi
                  </td>
                </tr>
              ) : (
              categories.map((category: any, index: number) => (
                <motion.tr
                  key={category.id}
                  className="border-b transition-colors duration-200"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {
                      category.translations.find(
                        (t: any) => t.language?.code === "uz"
                      )?.name
                    }
                  </td>
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {
                      category.translations.find(
                        (t: any) => t.language?.code === "ru"
                      )?.name
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-md transition-all duration-200"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#ffffff",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiEdit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(category.id)}
                        className="p-2 rounded-md transition-all duration-200"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(239, 68, 68, 0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-white/20 text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-white font-mono text-sm">
            {t("page")} {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-white/20 text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={t("delete.confirm")}
        message="Kategoriya o'chirilishi bilan bog'liq barcha ma'lumotlar ham o'chiriladi. Bu amal qaytarilmaydi!"
        confirmText={t("delete")}
        cancelText="Bekor qilish"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteConfirm(false); setDeletingId(null); }}
        loading={isDeleting}
        danger
      />
    </motion.div>
  );
}

function CategoryForm({
  category,
  onClose,
}: {
  category?: any;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: createCategory } = useCreateCategory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    translations: getInitilizeCategoryFormData(category?.translations),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saveToastId = showToast.loading(
      category ? t("updating.category") : t("creating.category")
    );

    try {
      let res;
      if (category) {
        res = await updateCategory({
          id: category.id,
          data: formData.translations,
        });
      } else {
        res = await createCategory({ data: formData });
      }
      if (res?.status == 200 || res?.status == 201) {
        showToast.update(
          saveToastId,
          "success",
          category
            ? t("category.updated.successfully")
            : t("category.created.successfully")
        );
      } else {
        dispatch(logout());
        removeAccessToken();
        showToast.update(saveToastId, "error", t("save.failed"));
      }
      onClose();
    } catch (error) {
      showToast.update(saveToastId, "error", t("save.failed"));
    }
  };

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{
        background: "rgba(0, 0, 0, 0.8)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-lg shadow-xl p-8 w-full max-w-md"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-xl font-bold mb-6"
          style={{
            color: "#ffffff",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {category ? t("edit.category") : t("add.category")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.translations.map((translation: any, index: number) => (
            <div key={index}>
              <label
                className="block text-sm font-semibold mb-2"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Name ({translation.languageId === "uz" ? "Uzbek" : "Russian"})
              </label>
              <input
                type="text"
                required
                value={translation.name}
                onChange={(e) => {
                  const newTranslations = [...formData.translations];
                  newTranslations[index] = {
                    ...translation,
                    name: e.target.value,
                  };
                  setFormData({ ...formData, translations: newTranslations });
                }}
                className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ffffff";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(255, 255, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "600",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t("cancel")}
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-3 rounded-lg transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
                color: "#000000",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "700",
              }}
              whileHover={{
                scale: 1.05,
                background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                color: "#ffffff",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category ? t("update") : t("create")}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
