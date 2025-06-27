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
import { showToast } from "@/lib/toast";
import { ProductDetailSkeleton } from "../../../components/skelton";

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
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="main-electronics-bg min-h-screen">
        <Header />
        <div className="container py-8 text-center">
          <div className="max-w-md mx-auto p-6 rounded-lg border border-neutral-700 bg-neutral-900">
            <h2 className="text-xl font-semibold text-white mb-3">
              {t("product.not.found")}
            </h2>
            <button
              onClick={() => router.push("/products")}
              className="btn btn-outline text-white border-white hover:bg-neutral-800 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              {t("back.to.products")}
            </button>
          </div>
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

  const handleImageChange = (idx: number) => {
    setSelectedImageIndex(idx);
    setIsImageLoading(true);
  };

  return (
    <div className="main-electronics-bg min-h-screen text-sm text-white">
      <Header />
      <main className="container px-4 sm:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="btn btn-outline text-white border-white hover:bg-neutral-800 mb-6 flex items-center gap-2 text-sm sm:text-base transition-colors duration-200"
        >
          <FiArrowLeft size={16} />
          {t("back")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Image Section */}
          <div>
            <div className="relative rounded-lg border border-neutral-700 mb-4 overflow-hidden bg-neutral-800">
              <Image
                src={
                  `${BASE_URL || ""}/uploads/${
                    product.images?.[selectedImageIndex]?.url
                  }` || "/placeholder.svg"
                }
                alt={translation?.name || "Product"}
                width={500}
                height={500}
                className={`w-full h-64 sm:h-80 md:h-[400px] object-cover transition-opacity duration-300 ${
                  isImageLoading ? "opacity-50" : "opacity-100"
                }`}
                onLoad={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-t-white border-neutral-600 rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
              {product.images?.map((img: any, idx: any) => (
                <button
                  key={img.id}
                  onClick={() => handleImageChange(idx)}
                  className={`w-16 h-16 rounded-md overflow-hidden border transition-all duration-200 hover:opacity-80 ${
                    selectedImageIndex === idx
                      ? "border-white ring-2 ring-white/50"
                      : "border-neutral-600 hover:border-neutral-400"
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
              <p className="text-sm sm:text-base md:text-lg leading-relaxed break-words text-neutral-300">
                {translation?.description}
              </p>
            </div>

            <div className="p-4 border border-neutral-700 rounded-md bg-neutral-900">
              <label className="block mb-2 font-medium">{t("quantity")}</label>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center border border-white rounded hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={18} />
                </button>
                <span className="font-semibold w-10 sm:w-12 text-center bg-neutral-800 py-2 rounded">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center border border-white rounded hover:bg-neutral-800 transition-colors duration-200"
                >
                  <FiPlus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 border border-white rounded py-2 sm:py-3 px-4 hover:bg-neutral-700 text-sm sm:text-base transition-all duration-200 hover:border-neutral-300 font-medium"
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
