import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PhoneButton from "@/components/PhoneButton";

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
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <PhoneButton />
        </Providers>
      </body>
    </html>
  );
}
