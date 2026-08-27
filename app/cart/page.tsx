"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/features/cartSlice";
import Header from "@/components/Header";
import OrderForm from "@/components/OrderForm";
import TelegramLoginModal from "@/components/auth/TelegramLoginModal";
import { triggerHaptic } from "@/lib/telegram";
import { showToast } from "@/lib/toast";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
  FiCheckCircle,
  FiShield,
  FiTruck,
  FiPackage,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

export default function CartPage() {
  const dispatch = useDispatch();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { items, total } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userAuth
  );

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(Number(price) || 0);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedCheckout = () => {
    triggerHaptic("selection");
    if (!isAuthenticated || !user) {
      showToast.warning("Buyurtma berish uchun avval Telegram orqali kiring");
      setShowLoginModal(true);
      return;
    }
    setShowOrderModal(true);
  };

  const handleClearCart = () => {
    triggerHaptic("warning");
    dispatch(clearCart());
    showToast.info("Savat tozalandi");
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-5 md:pt-24 pb-24">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <FiArrowLeft size={14} />
              <span>Bosh sahifa</span>
            </Link>
            <span>/</span>
            <span className="text-white">Savat</span>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-zinc-500 hover:text-red-400 flex items-center gap-1.5 transition-colors text-xs font-mono"
            >
              <FiTrash2 size={13} />
              <span>Savatni tozalash</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto shadow-xl shadow-amber-400/5">
              <FiShoppingBag size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-mono text-white">
                Savatingiz hozircha bo'sh
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Katalogimizdan kerakli mikrokontroller, datchik yoki robototexnika qismlarini tanlang
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-amber-400 text-black font-bold font-mono text-sm hover:bg-amber-300 active:scale-98 transition-all shadow-lg shadow-amber-400/10"
            >
              <FiPackage size={16} />
              <span>Katalogga o'tish</span>
            </Link>
          </div>
        ) : (
          /* Cart Content: Items + Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h1 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                  <FiShoppingBag className="text-amber-400" />
                  <span>Savatdagi mahsulotlar ({totalItemsCount})</span>
                </h1>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4 transition-all hover:border-white/20"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {item.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-900 border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 flex-shrink-0">
                        <FiPackage size={22} />
                      </div>
                    )}

                    <div className="min-w-0 space-y-1">
                      <h3 className="font-medium text-sm text-white truncate font-mono">
                        {item.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-amber-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity controls + Delete */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => {
                          triggerHaptic("light");
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          );
                        }}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
                        aria-label="Kamaytirish"
                      >
                        <FiMinus size={12} />
                      </button>

                      <span className="w-6 text-center text-xs font-bold font-mono text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          triggerHaptic("light");
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          );
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                        aria-label="Ko'paytirish"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        triggerHaptic("medium");
                        dispatch(removeFromCart(item.id));
                      }}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="O'chirish"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary Card (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl space-y-5 backdrop-blur-md">
                <h2 className="text-base font-bold font-mono text-white pb-3 border-b border-white/10">
                  Buyurtma hisobi
                </h2>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Mahsulotlar soni:</span>
                    <span className="text-white font-bold">{totalItemsCount} dona</span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span>Yetkazib berish:</span>
                    <span className="text-emerald-400 font-bold">Kelishilgan holda</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-zinc-300 font-bold">Jami summa:</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-400">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                {!isAuthenticated || !user ? (
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleProceedCheckout}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white font-bold font-mono text-sm hover:brightness-110 active:scale-98 shadow-xl shadow-[#0088cc]/20 transition-all flex items-center justify-center gap-2"
                    >
                      <FaTelegramPlane size={16} />
                      <span>Buyurtma berish</span>
                    </button>
                    <p className="text-[11px] text-center text-zinc-400 font-mono">
                      (Avval bot orqali ro'yxatdan o'ting)
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedCheckout}
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 text-black font-bold font-mono text-sm hover:bg-amber-300 active:scale-98 shadow-xl shadow-amber-400/15 transition-all flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle size={17} />
                    <span>Buyurtmani rasmiylashtirish</span>
                  </button>
                )}

                {/* Security badges */}
                <div className="pt-4 border-t border-white/5 space-y-2 text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-emerald-400 flex-shrink-0" />
                    <span>Xavfsiz va kafolatlangan xarid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-cyan-400 flex-shrink-0" />
                    <span>O'zbekiston bo'ylab tezkor yetkazib berish</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order placement modal */}
      {showOrderModal && <OrderForm onClose={() => setShowOrderModal(false)} />}

      {/* Telegram Auth Login Modal */}
      <TelegramLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
