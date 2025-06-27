import React from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { SkeletonBox } from "./SkeletonBox";
import { SkeletonText } from "./SkeletonText";
import { SkeletonImage } from "./SkeletonImage";
import { SkeletonButton } from "./SkeletonButton";

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="main-electronics-bg min-h-screen text-sm text-white">
      <Header />
      <main className="container px-4 sm:px-6 py-6">
        {/* Back Button Skeleton */}
        <SkeletonButton size="md" className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Image Section Skeleton */}
          <div>
            {/* Main Image Skeleton */}
            <SkeletonImage
              className="h-64 sm:h-80 md:h-[400px] mb-4 border border-neutral-700"
              aspectRatio="landscape"
              rounded="lg"
            />

            {/* Thumbnail Images Skeleton */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonBox
                  key={idx}
                  className="w-16 h-16 border border-neutral-600"
                  rounded="md"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-5">
            {/* Title Skeleton */}
            <SkeletonBox className="h-8 w-3/4" />

            {/* Price Skeleton */}
            <SkeletonBox className="h-6 w-32" />

            {/* Description Section Skeleton */}
            <div className="p-4 border border-neutral-700 rounded-md bg-neutral-900">
              <SkeletonBox className="h-6 w-24 mb-3" />
              <SkeletonText lines={3} lastLineWidth="3/4" />
            </div>

            {/* Quantity and Add to Cart Section Skeleton */}
            <div className="p-4 border border-neutral-700 rounded-md bg-neutral-900">
              <SkeletonBox className="h-5 w-20 mb-3" />

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mb-4">
                <SkeletonBox
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  rounded="md"
                />
                <SkeletonBox className="w-10 h-6" />
                <SkeletonBox
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  rounded="md"
                />
              </div>

              {/* Add to Cart Button */}
              <SkeletonButton fullWidth size="lg" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Cart />
    </div>
  );
};
