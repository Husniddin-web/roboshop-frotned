"use client";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import type { Product } from "@/lib/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const translation = product.translations?.[0];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: translation?.name || "Product",
        price: Number(product.price),
        image: product.images?.[0]?.url,
      })
    );
    showToast.success(`${translation?.name} ${t("added.to.cart")}`);
  };

  const formattedPrice = new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <div
      className="product-card rounded-xl overflow-hidden w-full max-w-sm mx-auto sm:max-w-none shadow-lg transition-all duration-300 ease-in-out"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "1px solid rgba(250, 204, 21, 0.3)",
        color: "#facc15",
      }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={
              product.images?.[0]?.url
                ? `${BASE_URL}/uploads/${product.images[0].url}`
                : "/placeholder.svg"
            }
            alt={translation?.name || "Product"}
            width={300}
            height={200}
            className="product-image object-cover w-full h-32 sm:h-36 md:h-44 lg:h-48 xl:h-52 transition-opacity duration-300"
          />
        </div>
      </Link>

      <div className="product-info p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-yellow-400 transition-colors duration-200 line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight">
            {translation?.name}
          </h3>
        </Link>

        <p className="text-yellow-100/80 line-clamp-2 text-xs sm:text-xs md:text-sm leading-relaxed">
          {translation?.description
            ? `${translation.description.substring(0, 50)}${
                translation.description.length > 50 ? "..." : ""
              }`
            : "No description available..."}
        </p>

        <div className="font-bold text-yellow-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          {formattedPrice}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full font-semibold rounded-lg transition-all duration-300 ease-in-out border-2 border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 active:bg-yellow-600 active:border-yellow-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 min-h-[40px] sm:min-h-[44px] md:min-h-[48px] touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2 group"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors duration-200">
            <Plus size={12} className="text-black" />
          </div>
          <ShoppingCart size={16} className="text-black" />
          <span className="hidden xs:inline text-xs sm:text-sm md:text-base font-medium truncate">
            {t("add.to.cart")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
