import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  useCategory,
  useCreateProduct,
  useOneProductForAdmin,
  useUpdateProduct,
} from "../../lib/api";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../lib/getImageUrl";
import { getInitilizeData } from "../../lib/getInitilizeFormData";
import { showToast } from "../../lib/toast";
import { logout } from "../../lib/features/authSlice";
import { removeAccessToken } from "../../lib/cookies";
import { motion } from "@/lib/no-motion";
import ImageUpload from "./ImageUpload";
import { FiX } from "react-icons/fi";

function ProductForm({
  productId,
  onClose,
}: {
  productId?: string | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: product, isLoading } = useOneProductForAdmin(productId);

  const [formData, setFormData] = useState({
    price: "",
    categoryId: "",
    images: [],
    translations: [
      { name: "", description: "", languageId: "uz" },
      { name: "", description: "", languageId: "ru" },
    ],
  });

  useEffect(() => {
    if (!isLoading && product?.data) {
      setFormData({
        price: product.data.price || "",
        categoryId: product.data.categoryId || "",
        images: getImageUrl(product.data.images),
        translations: getInitilizeData(product.data.translations),
      });
    }
  }, [isLoading, product]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { data: category } = useCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = showToast.loading(
      product ? t("updating.product") : t("creating.product")
    );
    try {
      const productData = { ...formData };
      if (product) {
        await updateProductMutation.mutateAsync({
          id: productId!,
          data: productData,
        });
        showToast.update(toastId, "success", t("product.updated.successfully"));
      } else {
        const res = await createProductMutation.mutateAsync(productData);
        if (res?.status === 201) {
          showToast.update(
            toastId,
            "success",
            t("product.created.successfully")
          );
        } else {
          dispatch(logout());
          removeAccessToken();
          showToast.update(toastId, "error", t("admin.relogin"));
        }
      }
      onClose();
    } catch {
      dispatch(logout());
      removeAccessToken();
      showToast.update(toastId, "error", t("admin.relogin"));
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
    >
      <motion.div
        className="rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className="text-xl font-bold"
            style={{
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {product ? t("edit.product") : t("add.product")}
          </h3>
          <motion.button
            onClick={onClose}
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
            <FiX size={20} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            images={formData.images}
            onImagesChange={(images: any) =>
              setFormData({ ...formData, images })
            }
            maxImages={5}
          />

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {t("price")}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ffffff";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {t("category")}
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ffffff";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="" disabled>
                {t("select.category")}
              </option>
              {category?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.translations?.[0]?.name || "Unnamed"}
                </option>
              ))}
            </select>
          </div>

          {formData.translations.map((tr, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg space-y-4"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <p
                className="text-sm font-bold"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {tr.languageId === "uz" ? "O'zbek" : "Русский"}
              </p>
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("name")}
                </label>
                <input
                  type="text"
                  required
                  value={tr.name}
                  onChange={(e) => {
                    const translations = [...formData.translations];
                    translations[index].name = e.target.value;
                    setFormData({ ...formData, translations });
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
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("description")}
                </label>
                <textarea
                  value={tr.description}
                  onChange={(e) => {
                    const translations = [...formData.translations];
                    translations[index].description = e.target.value;
                    setFormData({ ...formData, translations });
                  }}
                  rows={4}
                  className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 resize-none"
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
            </motion.div>
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
              disabled={
                createProductMutation.isPending ||
                updateProductMutation.isPending
              }
              className="px-6 py-3 rounded-lg transition-all duration-200"
              style={{
                background:
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                    ? "rgba(255, 255, 255, 0.05)"
                    : "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
                color:
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                    ? "#a0a0a0"
                    : "#000000",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                cursor:
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                    ? "not-allowed"
                    : "pointer",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "700",
              }}
              whileHover={
                !createProductMutation.isPending &&
                !updateProductMutation.isPending
                  ? {
                      scale: 1.05,
                      background:
                        "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                      color: "#ffffff",
                    }
                  : {}
              }
              whileTap={
                !createProductMutation.isPending &&
                !updateProductMutation.isPending
                  ? { scale: 0.95 }
                  : {}
              }
            >
              {createProductMutation.isPending ||
              updateProductMutation.isPending ? (
                <motion.div
                  className="loading"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    borderTop: "2px solid #ffffff",
                    borderRadius: "50%",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ) : product ? (
                t("update")
              ) : (
                t("create")
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ProductForm;
