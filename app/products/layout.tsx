import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcha mahsulotlar — Arduino, ESP32, sensorlar",
  description:
    "RoboShop katalogi: Arduino platalari, ESP32, sensorlar, modullar, motorlar va robot to'plamlari. Narxlar so'mda, Toshkentda olib ketish yoki O'zbekiston bo'ylab yetkazib berish.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
