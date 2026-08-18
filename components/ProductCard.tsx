"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import type { Product } from "@/lib/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Plus, Minus, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
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
        quantity: quantity,
      })
    );
    showToast.success(
      `${quantity}x ${translation?.name || "Mahsulot"} ${t("added.to.cart")}`
    );
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const formattedPrice = new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10">
      {/* Product Image Link */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-zinc-900/80 aspect-[4/3] w-full">
        <Image
          src={
            product.images?.[0]?.url
              ? `${BASE_URL}/uploads/${product.images[0].url}`
              : "/placeholder.svg"
          }
          alt={translation?.name || "Product"}
          fill
          className="object-contain p-3 group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating In-stock badge */}
        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
          <CheckCircle2 size={11} />
          <span>Mavjud</span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div>
          <Link href={`/products/${product.id}`} className="block group-hover:text-amber-400 transition-colors">
            <h3 className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
              {translation?.name || "Elektron komponent"}
            </h3>
          </Link>

          <p className="text-zinc-400 text-xs line-clamp-2 mb-3 leading-relaxed">
            {translation?.description
              ? translation.description.substring(0, 70) + (translation.description.length > 70 ? "..." : "")
              : "Arduino va robototexnika loyihalari uchun mo'ljallangan komponent."}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="mb-3">
            <span className="text-xs text-zinc-400 block mb-0.5">Narxi:</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-400 tracking-tight">
              {formattedPrice}
            </span>
          </div>

          {/* Stepper + Quick Add CTA */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            {/* Stepper */}
            <div className="flex items-center bg-zinc-900/90 rounded-lg border border-white/10 p-0.5">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-xs font-semibold text-white select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all duration-200"
            >
              <ShoppingBag size={15} />
              <span className="truncate">{t("add.to.cart")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

