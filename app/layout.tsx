import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import PhoneButton from "@/components/PhoneButton";
import BottomNav from "@/components/layout/BottomNav";
import TelegramAutoAuth from "@/components/auth/TelegramAutoAuth";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Arduino Shop - Electronic Components & Technology",
  description:
    "Your one-stop shop for Arduino boards, sensors, modules and electronic components",
  generator: "v0.dev",
  icons: {
    icon: "/faviicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-[#070a12] text-white min-h-screen selection:bg-amber-400/20 selection:text-amber-400 pb-16 lg:pb-0`}>
        <Providers>
          <TelegramAutoAuth />
          {children}
          <PhoneButton />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
