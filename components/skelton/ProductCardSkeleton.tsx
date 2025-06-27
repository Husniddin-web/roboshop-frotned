"use client";
import React from "react";
import clsx from "clsx";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className={clsx(
        "product-card rounded-xl overflow-hidden w-full max-w-sm mx-auto sm:max-w-none shadow-lg animate-pulse",
        "transition-all duration-300 ease-in-out"
      )}
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "1px solid rgba(250, 204, 21, 0.3)",
        color: "#facc15",
      }}
    >
      {/* Skeleton Image */}
      <div className="relative w-full h-32 sm:h-36 md:h-44 lg:h-48 xl:h-52 bg-yellow-900/10" />

      {/* Skeleton Info */}
      <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* Title */}
        <div className="h-4 sm:h-5 md:h-6 bg-yellow-100/20 rounded w-3/4" />

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 sm:h-4 bg-yellow-100/10 rounded w-full" />
          <div className="h-3 sm:h-4 bg-yellow-100/10 rounded w-5/6" />
        </div>

        {/* Price */}
        <div className="h-5 sm:h-6 md:h-7 bg-yellow-100/20 rounded w-1/3" />

        {/* Button */}
        <div className="h-[40px] sm:h-[44px] md:h-[48px] bg-yellow-400/30 rounded-lg w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
