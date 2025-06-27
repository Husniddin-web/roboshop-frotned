import React from "react";
import { SkeletonBox } from "./SkeletonBox";
import { SkeletonText } from "./SkeletonText";
import { SkeletonImage } from "./SkeletonImage";
import { SkeletonButton } from "./SkeletonButton";

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showButton?: boolean;
  textLines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = "",
  showImage = true,
  showButton = true,
  textLines = 2,
}) => {
  return (
    <div
      className={`border border-neutral-700 rounded-lg p-4 bg-neutral-900 ${className}`}
    >
      {showImage && <SkeletonImage className="mb-4" aspectRatio="landscape" />}

      <div className="space-y-3">
        <SkeletonBox className="h-6 w-3/4" />
        <SkeletonText lines={textLines} />
        <SkeletonBox className="h-5 w-1/3" />

        {showButton && <SkeletonButton fullWidth className="mt-4" />}
      </div>
    </div>
  );
};
