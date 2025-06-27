import React from "react";
import { SkeletonBox } from "./SkeletonBox";

interface SkeletonButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  className = "",
  size = "md",
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <SkeletonBox
      className={`${fullWidth ? "w-full" : sizeClasses[size]} ${className}`}
      rounded="md"
    />
  );
};
