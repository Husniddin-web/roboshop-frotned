import React from "react";
import { SkeletonBox } from "./SkeletonBox";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: "full" | "3/4" | "1/2" | "1/3" | "1/4";
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  className = "",
  lastLineWidth = "3/4",
}) => {
  const widthClasses = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`h-4 ${
            index === lines - 1 && lines > 1
              ? widthClasses[lastLineWidth]
              : "w-full"
          }`}
        />
      ))}
    </div>
  );
};
