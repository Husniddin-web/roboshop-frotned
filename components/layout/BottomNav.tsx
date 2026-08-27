"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { triggerHaptic } from "@/lib/telegram";
import { FiHome, FiGrid, FiShoppingCart, FiUser } from "react-icons/fi";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.userAuth);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hide BottomNav on admin panel routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      id: "home",
      label: "Bosh sahifa",
      href: "/",
      icon: FiHome,
      isActive: pathname === "/",
    },
    {
      id: "products",
      label: "Katalog",
      href: "/products",
      icon: FiGrid,
      isActive: pathname.startsWith("/products"),
    },
    {
      id: "cart",
      label: "Savat",
      href: "/cart",
      icon: FiShoppingCart,
      isActive: pathname === "/cart",
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      id: "profile",
      label: isAuthenticated ? "Profil" : "Kirish",
      href: "/profile",
      icon: FiUser,
      isActive: pathname === "/profile",
      dot: isAuthenticated,
    },
  ];

  const handleNavClick = (href: string) => {
    triggerHaptic("selection");
    router.push(href);
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 md:hidden pointer-events-auto">
      <nav
        aria-label="Pastki navigatsiya paneli"
        className="w-full max-w-[280px] bg-[#0b0f19]/90 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.href)}
              aria-label={item.label}
              title={item.label}
              className={`relative w-12 h-10 rounded-full flex items-center justify-center transition-all duration-300 select-none ${
                active
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/30 scale-105"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon size={20} />

                {/* Badge for Cart */}
                {item.badge && !active && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-amber-400 text-black text-[9px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.badge && active && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-black text-amber-400 text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}

                {/* Dot for Authenticated Profile */}
                {item.dot && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0f19]" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
