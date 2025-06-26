"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useProduct } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast";

export default function ProductDetailPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: productData, isLoading } = useProduct(productId);
  const product = productData?.data || [];
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["product"] });
  }, [i18n.language, queryClient]);

  if (isLoading) {
    return (
      <div className="main-electronics-bg min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <motion.div
            className="loading mx-auto"
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(156,163,175,0.2)",
              borderTop: "4px solid #9ca3af",
              borderRadius: "50%",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-3 text-sm text-neutral-400">
            {t("loading.product")}
          </p>
        </div>
        <Footer />
        <Cart />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-electronics-bg min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto p-6 rounded-lg border border-neutral-700"
          >
            <h2 className="text-xl font-semibold text-white mb-3">
              {t("product.not.found")}
            </h2>
            <button
              onClick={() => router.push("/products")}
              className="btn btn-outline text-white border-white hover:bg-neutral-800"
            >
              <FiArrowLeft className="mr-2" />
              {t("back.to.products")}
            </button>
          </motion.div>
        </div>
        <Footer />
        <Cart />
      </div>
    );
  }

  const translation = product.translations?.[0];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: translation?.name || "Product",
          price: Number(product.price),
          image: product.images?.[0]?.url,
        })
      );
    }
    showToast.success(
      `${quantity}x ${translation?.name} ${t("added.to.cart")}`
    );
  };

  return (
    <div className="main-electronics-bg min-h-screen text-sm text-white">
      <Header />
      <main className="container px-4 sm:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="btn btn-outline text-white border-white hover:bg-neutral-800 mb-6 flex items-center gap-2 text-sm sm:text-base"
        >
          <FiArrowLeft size={16} />
          {t("back")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Image Section */}
          <div>
            <div className="relative rounded-lg border border-neutral-700 mb-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={
                      `${BASE_URL || ""}/uploads/${
                        product.images?.[selectedImageIndex]?.url
                      }` || "/placeholder.svg"
                    }
                    alt={translation?.name || "Product"}
                    width={500}
                    height={500}
                    className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
                    onLoad={() => setIsImageLoading(false)}
                  />
                </motion.div>
              </AnimatePresence>
              {isImageLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="loading w-6 h-6 border-2 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
              {product.images?.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setIsImageLoading(true);
                  }}
                  className={`w-16 h-16 rounded-md overflow-hidden border ${
                    selectedImageIndex === idx
                      ? "border-white"
                      : "border-neutral-600"
                  }`}
                >
                  <Image
                    src={`${BASE_URL}/uploads/${img.url}`}
                    alt={`thumb-${idx}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <h1 className="text-lg sm:text-xl font-bold">
              {translation?.name}
            </h1>
            <div className="text-base sm:text-lg font-semibold text-neutral-400">
              {Number(product.price).toFixed(2)} UZS
            </div>

            <div className="p-4 border border-neutral-700 rounded-md bg-neutral-900">
              <h2 className="font-semibold mb-2 text-base sm:text-lg">
                {t("description")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed break-words">
                {translation?.description}
              </p>
            </div>

            <div className="p-4 border border-neutral-700 rounded-md bg-neutral-900">
              <label className="block mb-2 font-medium">{t("quantity")}</label>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center border border-white rounded hover:bg-neutral-800"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={18} />
                </button>
                <span className="font-semibold w-10 sm:w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center border border-white rounded hover:bg-neutral-800"
                >
                  <FiPlus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 border border-white rounded py-2 sm:py-3 px-4 hover:bg-neutral-700 text-sm sm:text-base"
              >
                <FiShoppingCart />
                {t("add.to.cart")} -{" "}
                {(Number(product.price) * quantity).toFixed(2)} UZS
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Cart />
    </div>
  );
}
