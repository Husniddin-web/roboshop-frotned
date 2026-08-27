"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { setCartOpen } from "@/lib/features/cartSlice";
import { triggerHaptic } from "@/lib/telegram";
import { FiHome, FiGrid, FiShoppingCart, FiUser } from "react-icons/fi";
import TelegramLoginModal from "../auth/TelegramLoginModal";
import ProfileModal from "../profile/ProfileModal";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userAuth
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hide BottomNav on admin panel routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleProfileClick = () => {
    triggerHaptic("selection");
    if (isAuthenticated && user) {
      setIsProfileOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleCartClick = () => {
    triggerHaptic("selection");
    dispatch(setCartOpen(true));
  };

  return (
    <>
      <nav
        aria-label="Pastki navigatsiya paneli"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f17]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* 1. Bosh sahifa */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("selection");
            router.push("/");
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            pathname === "/" ? "text-amber-400 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiHome size={20} />
          <span className="text-[10px] font-mono">Bosh sahifa</span>
        </button>

        {/* 2. Katalog */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("selection");
            router.push("/products");
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            pathname.startsWith("/products")
              ? "text-amber-400 font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiGrid size={20} />
          <span className="text-[10px] font-mono">Katalog</span>
        </button>

        {/* 3. Savat */}
        <button
          type="button"
          onClick={handleCartClick}
          className="flex flex-col items-center gap-1 p-1.5 text-zinc-400 hover:text-white relative transition-colors"
        >
          <div className="relative">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono">Savat</span>
        </button>

        {/* 4. Profil / Kirish */}
        <button
          type="button"
          onClick={handleProfileClick}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            isProfileOpen ? "text-amber-400 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <FiUser size={20} />
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0d0f17]" />
            )}
          </div>
          <span className="text-[10px] font-mono">
            {isAuthenticated ? "Profil" : "Kirish"}
          </span>
        </button>
      </nav>

      <TelegramLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
