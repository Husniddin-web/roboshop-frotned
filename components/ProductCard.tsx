"use client";
import React, { useState } from "react"; // Import useState
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import type { Product } from "@/lib/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus, Minus } from "lucide-react"; // Import Minus icon

interface ProductCardProps {
  product: Product;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const translation = product.translations?.[0];

  // Function to add the selected quantity to the cart
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: translation?.name || "Product",
        price: Number(product.price),
        image: product.images?.[0]?.url,
        quantity: quantity, // Use the state quantity
      })
    );
    showToast.success(
      `${quantity}x ${translation?.name} ${t("added.to.cart")}`
    );
  };

  // Decrement quantity, but not below 1
  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Increment quantity
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const formattedPrice = new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <div
      className="product-card flex flex-col rounded-xl overflow-hidden w-full max-w-sm mx-auto sm:max-w-none shadow-lg transition-all duration-300 ease-in-out"
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

      <div className="product-info flex flex-col flex-grow p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
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

        <div className="flex-grow"></div>

        <div className="font-bold text-yellow-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          {formattedPrice}
        </div>

        {/* --- MODIFIED SECTION: Quantity Controls and Add Button --- */}
        <div className="flex items-stretch gap-2 sm:gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center border-2 border-yellow-400/50 rounded-lg">
            <button
              onClick={handleDecrement}
              className="px-2 py-2 text-yellow-300 hover:bg-yellow-500/20 rounded-l-md transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-base sm:text-lg text-white w-8 text-center select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="px-2 py-2 text-yellow-300 hover:bg-yellow-500/20 rounded-r-md transition-colors duration-200"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-grow font-semibold rounded-lg transition-all duration-300 ease-in-out border-2 border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 active:bg-yellow-600 active:border-yellow-600 py-2 sm:py-2.5 px-3 sm:px-4 touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <ShoppingCart size={16} className="text-black" />
            <span className="hidden xs:inline text-xs sm:text-sm md:text-base font-medium truncate">
              {t("add.to.cart")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
