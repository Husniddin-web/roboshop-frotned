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
    <div className="fixed bottom-2.5 left-3 right-3 z-40 max-w-md mx-auto md:hidden pointer-events-auto">
      <nav
        aria-label="Pastki navigatsiya paneli"
        className="bg-[#0b0f19]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-1.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.href)}
              className={`relative flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-2xl text-xs font-mono transition-all duration-300 select-none ${
                active
                  ? "bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/25 scale-[1.03]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon size={18} />

                {/* Badge for Cart */}
                {item.badge && !active && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.badge && active && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-black text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}

                {/* Dot for Authenticated Profile */}
                {item.dot && !active && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0f19]" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
