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

const SITE_URL = "https://roboshop.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arduino Shop - Electronic Components & Technology",
    template: "%s | Arduino Shop",
  },
  description:
    "Your one-stop shop for Arduino boards, sensors, modules and electronic components",
  generator: "v0.dev",
  keywords: [
    "RoboShop",
    "Arduino",
    "Arduino Uno",
    "ESP32",
    "sensorlar",
    "robototexnika",
    "robot to'plami",
    "Znatok",
    "elektronika do'koni Toshkent",
    "Arduino Ташкент",
    "робототехника Ташкент",
  ],
  applicationName: "RoboShop",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "RoboShop",
    locale: "uz_UZ",
    title: "Arduino Shop - Electronic Components & Technology",
    description:
      "Your one-stop shop for Arduino boards, sensors, modules and electronic components",
    images: [{ url: "/faviicon.png", width: 512, height: 512, alt: "RoboShop" }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/faviicon.png",
    apple: "/faviicon.png",
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
