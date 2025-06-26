"use client";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import type { Product } from "@/lib/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

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
    <motion.div
      className="product-card rounded-xl overflow-hidden w-full max-w-sm mx-auto sm:max-w-none shadow-lg"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "1px solid rgba(250, 204, 21, 0.3)",
        color: "#facc15",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 12px 35px rgba(250, 204, 21, 0.2)",
        borderColor: "rgba(250, 204, 21, 0.5)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <motion.div
          className="relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={
              product.images?.[0]?.url
                ? `${BASE_URL}/uploads/${product.images[0].url}`
                : "/placeholder.svg"
            }
            alt={translation?.name || "Product"}
            width={300}
            height={200}
            className="product-image object-cover w-full h-32 sm:h-36 md:h-44 lg:h-48 xl:h-52"
            style={{
              transition: "transform 0.3s ease-in-out",
            }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </Link>

      {/* Product Info */}
      <div className="product-info p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="block">
          <motion.h3
            className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-200 line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight"
            whileHover={{ scale: 1.01 }}
          >
            {translation?.name}
          </motion.h3>
        </Link>

        {/* Product Description */}
        <p className="text-yellow-100/80 line-clamp-2 text-xs sm:text-xs md:text-sm leading-relaxed">
          {translation?.description
            ? `${translation.description.substring(0, 50)}${
                translation.description.length > 50 ? "..." : ""
              }`
            : "No description available..."}
        </p>

        {/* Price */}
        <div className="font-bold text-yellow-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          {formattedPrice}
        </div>

        {/* Add to Cart Button with Icon */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full font-semibold rounded-lg transition-all duration-300 border-2 border-yellow-400 bg-yellow-400 text-black hover:bg-transparent hover:text-yellow-300 hover:border-yellow-300 active:scale-95 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 min-h-[40px] sm:min-h-[44px] md:min-h-[48px] touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(250, 204, 21, 0.2)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={"18px"} />
          {/* Text - hidden on small mobile, visible on larger screens */}
          <span className="hidden xs:inline text-xs sm:[5px] md:text-base font-medium truncate">
            {t("add.to.cart")}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
