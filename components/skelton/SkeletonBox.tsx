import React from "react";

interface SkeletonBoxProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
}) => {
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`animate-pulse bg-neutral-700 ${roundedClasses[rounded]} ${className}`}
      style={{ animationDuration: "1.5s", ...style }}
    />
  );
};
