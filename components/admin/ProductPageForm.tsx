"use client";
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
import { motion, AnimatePresence } from "@/lib/no-motion";
import ImageUpload from "./ImageUpload";
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

/* ── Input field helper ─────────────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 focus:bg-yellow-400/5 focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] transition-all";

/* ── Main ProductPageForm ───────────────────────────────── */
export default function ProductPageForm({
  productId,
}: {
  productId?: string | null;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const isEditing = !!productId;
  const { data: product, isLoading } = useOneProductForAdmin(productId);
  const { data: category } = useCategory();

  /* ── Language tab ─────────────────────────── */
  const [activeLang, setActiveLang] = useState<"uz" | "ru">("uz");

  const [formData, setFormData] = useState({
    price: "",
    categoryId: "",
    isActive: true,
    images: [] as any[],
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
        isActive: product.data.isActive ?? true,
        images: getImageUrl(product.data.images),
        translations: getInitilizeData(product.data.translations),
      });
    }
  }, [isLoading, product]);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = showToast.loading(
      isEditing ? t("updating.product") : t("creating.product")
    );
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: productId!, data: formData });
        showToast.update(toastId, "success", t("product.updated.successfully"));
      } else {
        const res = await createMutation.mutateAsync(formData);
        if (res?.status === 201) {
          showToast.update(toastId, "success", t("product.created.successfully"));
        } else {
          dispatch(logout());
          removeAccessToken();
          showToast.update(toastId, "error", t("admin.relogin"));
          return;
        }
      }
      router.push("/admin/products");
    } catch {
      dispatch(logout());
      removeAccessToken();
      showToast.update(toastId, "error", t("admin.relogin"));
    }
  };

  const setTr = (lang: "uz" | "ru", field: "name" | "description", val: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.languageId === lang ? { ...tr, [field]: val } : tr
      ),
    }));
  };

  const getTr = (lang: "uz" | "ru") =>
    formData.translations.find((tr) => tr.languageId === lang) || {
      name: "",
      description: "",
      languageId: lang,
    };

  const uzTr = getTr("uz");
  const ruTr = getTr("ru");
  const bothFilled = uzTr.name.trim() && ruTr.name.trim();

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* ── Top bar ────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/8 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push("/admin/products")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-mono"
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft size={18} />
              <span className="hidden sm:inline">Orqaga</span>
            </motion.button>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <FiPackage size={18} className="text-yellow-400" />
              <h1 className="text-base font-bold font-mono uppercase tracking-widest text-white">
                {isEditing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </h1>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit as any}
            disabled={isPending || !bothFilled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold font-mono transition-all ${
              isPending || !bothFilled
                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
            whileTap={!isPending ? { scale: 0.95 } : {}}
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <FiSave size={16} />
            )}
            {isPending ? "Saqlanmoqda..." : isEditing ? "Yangilash" : "Saqlash"}
          </motion.button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column: images + meta ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* Images */}
            <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-4">
                Rasmlar
              </p>
              <ImageUpload
                images={formData.images}
                onImagesChange={(imgs: any) =>
                  setFormData((p) => ({ ...p, images: imgs }))
                }
                maxImages={5}
              />
            </div>

            {/* Price */}
            <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">
                Ma'lumotlar
              </p>
              <Field label="Narx (UZS)">
                <div className="relative">
                  <FiDollarSign
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="0.00"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Kategoriya">
                <div className="relative">
                  <FiTag
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className={`${inputCls} pl-9 appearance-none`}
                  >
                    <option value="" disabled>
                      Tanlang...
                    </option>
                    {category?.map((cat: any) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        style={{ background: "#1a1a1a" }}
                      >
                        {cat.translations?.[0]?.name || "Nomsiz"}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">
                  Holati
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, isActive: !p.isActive }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.isActive ? "bg-green-500" : "bg-white/10"
                  }`}
                >
                  <motion.span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
                    animate={{ x: formData.isActive ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {formData.isActive && (
                      <FiCheck size={10} className="text-green-600" />
                    )}
                  </motion.span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column: translations ── */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-white/3 border border-white/8">
              {/* Tab switcher */}
              <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
                {(["uz", "ru"] as const).map((lang) => {
                  const tr = getTr(lang);
                  const filled = tr.name.trim();
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold font-mono transition-all ${
                        activeLang === lang
                          ? "bg-yellow-400 text-black shadow-md"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang === "uz" ? "🇺🇿 O'zbek" : "🇷🇺 Русский"}
                      {filled && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            activeLang === lang ? "bg-green-700" : "bg-green-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* UZ tab */}
              <AnimatePresence mode="wait">
                {activeLang === "uz" && (
                  <motion.div
                    key="uz"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-5"
                  >
                    <Field label="Nomi (O'zbek)">
                      <input
                        type="text"
                        required
                        placeholder="Masalan: Arduino Uno R3"
                        value={uzTr.name}
                        onChange={(e) => setTr("uz", "name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Tavsif (O'zbek)">
                      <textarea
                        rows={6}
                        placeholder="Mahsulot haqida to'liq ma'lumot..."
                        value={uzTr.description}
                        onChange={(e) =>
                          setTr("uz", "description", e.target.value)
                        }
                        className={`${inputCls} resize-none`}
                      />
                    </Field>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveLang("ru")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-sm font-mono transition-colors"
                      >
                        Keyingisi: Ruscha →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* RU tab */}
                {activeLang === "ru" && (
                  <motion.div
                    key="ru"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-5"
                  >
                    <Field label="Название (Русский)">
                      <input
                        type="text"
                        placeholder="Например: Arduino Uno R3"
                        value={ruTr.name}
                        onChange={(e) => setTr("ru", "name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Описание (Русский)">
                      <textarea
                        rows={6}
                        placeholder="Подробное описание товара..."
                        value={ruTr.description}
                        onChange={(e) =>
                          setTr("ru", "description", e.target.value)
                        }
                        className={`${inputCls} resize-none`}
                      />
                    </Field>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveLang("uz")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-sm font-mono transition-colors"
                      >
                        ← O'zbekcha
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fill indicator */}
              <div className="mt-6 pt-5 border-t border-white/8 flex items-center gap-4">
                {(["uz", "ru"] as const).map((lang) => {
                  const tr = getTr(lang);
                  const ok = !!tr.name.trim();
                  return (
                    <div key={lang} className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-white/15"}`}
                      />
                      <span className={`text-xs font-mono ${ok ? "text-green-400" : "text-gray-600"}`}>
                        {lang === "uz" ? "O'zbek" : "Ruscha"} {ok ? "✓" : "— to'ldirilmagan"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

