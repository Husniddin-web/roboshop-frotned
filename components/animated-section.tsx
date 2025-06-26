"use client";

import type { ReactNode } from "react";
import { useScrollAnimation } from "../hooks/use-scroll-animation";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fade-in-up" | "fade-in-left" | "fade-in-right" | "scale-in";
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = "fade-in-up",
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  const delayClass = delay > 0 ? `animate-delay-${delay}` : "";
  const animationClass = isVisible ? `animate-${animation}` : "";

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${animationClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
