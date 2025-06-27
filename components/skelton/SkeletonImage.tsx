import React from "react";
import { SkeletonBox } from "./SkeletonBox";

interface SkeletonImageProps {
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  className = "",
  aspectRatio = "square",
  rounded = "md",
}) => {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  return (
    <SkeletonBox
      className={`w-full ${aspectClasses[aspectRatio]} ${className}`}
      rounded={rounded}
    />
  );
};
