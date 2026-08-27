"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/lib/store";
import {
  useCategory,
  useCreateProduct,
  useOneProductForAdmin,
  useUpdateProduct,
} from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { getInitilizeData } from "@/lib/getInitilizeFormData";
import { showToast } from "@/lib/toast";
import { logout } from "@/lib/features/authSlice";
import { getAccessToken, removeAccessToken } from "@/lib/cookies";
import { motion, AnimatePresence } from "@/lib/no-motion";
import ImageUpload from "./ImageUpload";
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

/* ── Minimal Input Field Wrapper ─────────────────────────── */
function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
          {label}
          {required && <span className="text-amber-400 font-bold">*</span>}
        </label>
        {hint && <span className="text-[11px] text-zinc-500 font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputStyles =
  "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400/80 focus:bg-amber-400/[0.02] focus:ring-2 focus:ring-amber-400/10 transition-all duration-200";

/* ── Main ProductPageForm Component ──────────────────────── */
export default function ProductPageForm({
  productId,
}: {
  productId?: string | null;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Authentication check
  useEffect(() => {
    const token = getAccessToken();
    if (!token || !isAuthenticated) {
      removeAccessToken();
      dispatch(logout());
      router.replace("/admin");
    }
  }, [isAuthenticated, dispatch, router]);

  const isEditing = !!productId;
  const { data: product, isLoading: isProductLoading } =
    useOneProductForAdmin(productId);
  const { data: categories, isLoading: isCategoriesLoading } = useCategory();

  const [activeLang, setActiveLang] = useState<"uz" | "ru">("uz");

  const [formData, setFormData] = useState({
    price: "",
    categoryId: "",
    images: [] as string[],
    translations: [
      { name: "", description: "", languageId: "uz" },
      { name: "", description: "", languageId: "ru" },
    ],
  });

  // Populate data when editing
  useEffect(() => {
    if (!isProductLoading && product?.data) {
      setFormData({
        price: product.data.price ? String(product.data.price) : "",
        categoryId: product.data.categoryId || "",
        images: getImageUrl(product.data.images) || [],
        translations: getInitilizeData(product.data.translations),
      });
    }
  }, [isProductLoading, product]);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const setTranslationField = (
    lang: "uz" | "ru",
    field: "name" | "description",
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.languageId === lang ? { ...tr, [field]: val } : tr
      ),
    }));
  };

  const getTranslation = (lang: "uz" | "ru") =>
    formData.translations.find((tr) => tr.languageId === lang) || {
      name: "",
      description: "",
      languageId: lang,
    };

  const uzTr = getTranslation("uz");
  const ruTr = getTranslation("ru");
  const isValid =
    (uzTr.name.trim() || ruTr.name.trim()) &&
    formData.categoryId &&
    Number(formData.price) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      showToast.warning("Iltimos, mahsulot kategoriyasini tanlang");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      showToast.warning("Iltimos, to'g'ri narx kiriting");
      return;
    }

    if (!uzTr.name.trim() && !ruTr.name.trim()) {
      showToast.warning("Iltimos, kamida bitta tilda mahsulot nomini kiriting");
      return;
    }

    const toastId = showToast.loading(
      isEditing ? "Mahsulot yangilanmoqda..." : "Mahsulot yaratilmoqda..."
    );

    try {
      const parsedPrice = parseFloat(String(formData.price)) || 0;

      if (isEditing) {
        // Prepare payload strictly according to backend UpdateProductDto
        const updatePayload = {
          price: parsedPrice,
          categoryId: formData.categoryId,
          images: formData.images,
          translations: [
            {
              productId: productId!,
              languageId: "uz",
              name: uzTr.name.trim() || ruTr.name.trim(),
              description: uzTr.description.trim(),
            },
            {
              productId: productId!,
              languageId: "ru",
              name: ruTr.name.trim() || uzTr.name.trim(),
              description: ruTr.description.trim(),
            },
          ],
        };

        await updateMutation.mutateAsync({
          id: productId!,
          data: updatePayload,
        });

        showToast.update(toastId, "success", "Mahsulot muvaffaqiyatli yangilandi");
      } else {
        // Prepare payload strictly according to backend CreateProductDto
        const createPayload = {
          price: parsedPrice,
          categoryId: formData.categoryId,
          images: formData.images,
          translations: [
            {
              languageId: "uz",
              name: uzTr.name.trim() || ruTr.name.trim(),
              description: uzTr.description.trim(),
            },
            {
              languageId: "ru",
              name: ruTr.name.trim() || uzTr.name.trim(),
              description: ruTr.description.trim(),
            },
          ],
        };

        const res = await createMutation.mutateAsync(createPayload);
        if (res?.status === 201 || res?.data) {
          showToast.update(toastId, "success", "Mahsulot muvaffaqiyatli yaratildi");
        }
      }

      router.push("/admin/products");
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring";
      showToast.update(toastId, "error", errMsg);
    }
  };

  const formatCurrency = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("uz-UZ").format(num);
  };

  if (isProductLoading && isEditing) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">
            Mahsulot yuklanmoqda...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-amber-400/20 selection:text-amber-400">
      {/* ── Sticky Top Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-xs font-mono"
            >
              <FiArrowLeft size={14} />
              <span>Orqaga</span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <FiPackage size={16} />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-white">
                  {isEditing ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
                </h1>
                {isEditing && productId && (
                  <p className="text-[10px] text-zinc-500 font-mono truncate max-w-xs">
                    ID: {productId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit as any}
            disabled={isSubmitting || !isValid}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
              isSubmitting || !isValid
                ? "bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed"
                : "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/10 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <FiSave size={15} />
            )}
            <span>
              {isSubmitting
                ? "Saqlanmoqda..."
                : isEditing
                ? "Yangilash"
                : "Saqlash"}
            </span>
          </button>
        </div>
      </header>

      {/* ── Main Form Body ───────────────────────────────── */}
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left 2 Columns: Multi-language Details ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-sm space-y-6">
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                  {(["uz", "ru"] as const).map((lang) => {
                    const tr = getTranslation(lang);
                    const isFilled = !!tr.name.trim();
                    const isActive = activeLang === lang;

                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                          isActive
                            ? "bg-amber-400 text-black shadow-md"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>{lang === "uz" ? "🇺🇿 O'zbek" : "🇷🇺 Русский"}</span>
                        {isFilled && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-black" : "bg-emerald-400"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <FiInfo size={13} />
                  <span>Kamida bitta til to'ldirilishi kerak</span>
                </div>
              </div>

              {/* Translation Inputs */}
              <AnimatePresence mode="wait">
                {activeLang === "uz" ? (
                  <motion.div
                    key="uz"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    <FormField
                      label="Nomi (O'zbekcha)"
                      required
                      hint={`${uzTr.name.length} ta belgi`}
                    >
                      <input
                        type="text"
                        placeholder="Masalan: Arduino Uno R3 DIP"
                        value={uzTr.name}
                        onChange={(e) =>
                          setTranslationField("uz", "name", e.target.value)
                        }
                        className={inputStyles}
                        required
                      />
                    </FormField>

                    <FormField
                      label="Tavsifi (O'zbekcha)"
                      hint="Mahsulot haqida batafsil ma'lumot"
                    >
                      <textarea
                        rows={7}
                        placeholder="Texnik xususiyatlari, kuchlanish, mikrokontroller turi..."
                        value={uzTr.description}
                        onChange={(e) =>
                          setTranslationField("uz", "description", e.target.value)
                        }
                        className={`${inputStyles} resize-none leading-relaxed`}
                      />
                    </FormField>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ru"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                  >
                    <FormField
                      label="Название (Русский)"
                      hint={`${ruTr.name.length} символов`}
                    >
                      <input
                        type="text"
                        placeholder="Например: Arduino Uno R3 DIP"
                        value={ruTr.name}
                        onChange={(e) =>
                          setTranslationField("ru", "name", e.target.value)
                        }
                        className={inputStyles}
                      />
                    </FormField>

                    <FormField
                      label="Описание (Русский)"
                      hint="Подробное описание товара"
                    >
                      <textarea
                        rows={7}
                        placeholder="Технические характеристики, рабочее напряжение, интерфейсы..."
                        value={ruTr.description}
                        onChange={(e) =>
                          setTranslationField("ru", "description", e.target.value)
                        }
                        className={`${inputStyles} resize-none leading-relaxed`}
                      />
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column: Meta (Price, Category) ── */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-sm space-y-5">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono border-b border-white/10 pb-3">
                Asosiy ma'lumotlar
              </h2>

              {/* Price */}
              <FormField label="Narx (UZS)" required>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">
                    <FiDollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, price: e.target.value }))
                    }
                    className={`${inputStyles} pl-9 pr-16`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                    UZS
                  </div>
                </div>
                {formData.price && Number(formData.price) > 0 && (
                  <p className="text-[11px] font-mono text-amber-400/90 pt-1">
                    ≈ {formatCurrency(formData.price)} so'm
                  </p>
                )}
              </FormField>

              {/* Category */}
              <FormField label="Kategoriya" required>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <FiTag size={16} />
                  </div>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className={`${inputStyles} pl-9 appearance-none cursor-pointer`}
                  >
                    <option value="" disabled className="bg-zinc-900 text-zinc-500">
                      Kategoriyani tanlang...
                    </option>
                    {categories?.map((cat: any) => {
                      const catName =
                        cat.translations?.find(
                          (t: any) => t.language?.code === "uz"
                        )?.name ||
                        cat.translations?.[0]?.name ||
                        "Nomsiz kategoriya";

                      return (
                        <option
                          key={cat.id}
                          value={cat.id}
                          className="bg-zinc-900 text-white py-2"
                        >
                          {catName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </FormField>
            </div>
          </div>
        </div>

        {/* ── Media Card: Image Upload ── */}
        <div className="mt-6 p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
          <ImageUpload
            images={formData.images}
            onImagesChange={(imgs: string[]) =>
              setFormData((p) => ({ ...p, images: imgs }))
            }
            maxImages={5}
          />
        </div>
      </form>
    </div>
  );
}
