"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { customerLogout } from "@/lib/features/userAuthSlice";
import { useMyOrders } from "@/lib/api";
import Header from "@/components/Header";
import TelegramLoginModal from "@/components/auth/TelegramLoginModal";
import { triggerHaptic } from "@/lib/telegram";
import { showToast } from "@/lib/toast";
import {
  FiUser,
  FiPackage,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ComponentType<any> }
> = {
  PENDING: {
    label: "Kutilmoqda",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    icon: FiClock,
  },
  CONFIRMED: {
    label: "Tasdiqlandi",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: FiCheckCircle,
  },
  PROCESSING: {
    label: "Tayyorlanmoqda",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
    icon: FiPackage,
  },
  SHIPPED: {
    label: "Yetkazilmoqda",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    icon: FiTruck,
  },
  DELIVERED: {
    label: "Yetkazib berildi",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    icon: FiCheckCircle,
  },
  CANCELLED: {
    label: "Bekor qilindi",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
    icon: FiAlertCircle,
  },
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.userAuth
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data: myOrdersData, isLoading: isOrdersLoading } = useMyOrders(
    user?.telegramId ? String(user.telegramId) : undefined,
    user?.phoneNumber || undefined
  );

  const orders: any[] = myOrdersData?.data || [];
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(Number(price) || 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    triggerHaptic("selection");
    dispatch(customerLogout());
    showToast.info("Hisobingizdan chiqdingiz");
  };

  const toggleExpand = (id: string) => {
    triggerHaptic("light");
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-zinc-400">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Bosh sahifa</span>
          </Link>
          <span>/</span>
          <span className="text-white">Mening profilim</span>
        </div>

        {!isAuthenticated || !user ? (
          /* Unauthenticated State Card */
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#229ED9] to-[#0088cc] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#0088cc]/20">
              <FaTelegramPlane size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-mono text-white">
                Telegram orqali profilingizga kiring
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Buyurtmalaringiz holatini kuzatish, tarixini ko'rish va tezkor xarid qilish uchun hisobingizga kiring.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white font-bold font-mono text-sm shadow-xl shadow-[#0088cc]/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <FaTelegramPlane size={16} />
              <span>Telegram orqali kirish</span>
            </button>
          </div>
        ) : (
          /* Authenticated User Dashboard */
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.firstName || "Avatar"}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-black font-bold text-2xl flex items-center justify-center shadow-lg">
                      {(user.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0088cc] flex items-center justify-center text-white text-[10px] shadow">
                    <FaTelegramPlane />
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl font-bold font-mono text-white">
                    {user.firstName} {user.lastName || ""}
                  </h1>
                  <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                    <span>{user.username ? `@${user.username}` : `ID: ${user.telegramId}`}</span>
                    {user.phoneNumber && (
                      <>
                        <span>•</span>
                        <span>{user.phoneNumber}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-bold border border-red-500/20 transition-all active:scale-95"
              >
                <FiLogOut size={14} />
                <span>Chiqish</span>
              </button>
            </div>

            {/* Orders Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <FiShoppingBag size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-mono text-white">
                      Mening buyurtmalarim
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      Jami: {orders.length} ta buyurtma
                    </p>
                  </div>
                </div>
              </div>

              {/* Order List */}
              {isOrdersLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-zinc-500">
                    Buyurtmalar yuklanmoqda...
                  </span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 mx-auto">
                    <FiPackage size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-mono">
                      Hozircha buyurtmalar yo'q
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Katalogdagi robototexnika, mikrokontroller va datchiklardan tanlang
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold font-mono text-xs hover:bg-amber-300 transition-colors"
                  >
                    <span>Katalogni ko'rish</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const status =
                      statusConfig[order.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all hover:border-white/20"
                      >
                        {/* Order Header Row */}
                        <div
                          onClick={() => toggleExpand(order.id)}
                          className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs sm:text-sm font-mono font-bold text-white">
                                Buyurtma #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${status.bg} ${status.color} ${status.border}`}
                              >
                                <StatusIcon size={10} />
                                <span>{status.label}</span>
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                              <FiCalendar size={12} />
                              <span>{formatDate(order.createdAt)}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-bold font-mono text-amber-400">
                                {formatPrice(order.totalAmount)}
                              </span>
                              <p className="text-[11px] text-zinc-500 font-mono">
                                {order.orderItems?.length || 0} xil mahsulot
                              </p>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5 text-zinc-400">
                              {isExpanded ? (
                                <FiChevronUp size={16} />
                              ) : (
                                <FiChevronDown size={16} />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Details Body */}
                        {isExpanded && (
                          <div className="p-5 border-t border-white/10 bg-black/40 space-y-4 animate-in fade-in duration-150">
                            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                              Buyurtma tarkibi:
                            </h4>

                            <div className="space-y-2.5">
                              {order.orderItems?.map((item: any) => {
                                const title =
                                  item.product?.translations?.[0]?.name ||
                                  "Mahsulot";
                                const img = item.product?.images?.[0]?.url;
                                const fullImg = img
                                  ? `${BASE_URL}/uploads/${img}`
                                  : null;

                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 text-xs font-mono py-2 border-b border-white/5 last:border-none"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {fullImg ? (
                                        <img
                                          src={fullImg}
                                          alt={title}
                                          className="w-11 h-11 rounded-xl object-cover bg-zinc-800 flex-shrink-0 border border-white/10"
                                        />
                                      ) : (
                                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 flex-shrink-0">
                                          <FiPackage size={16} />
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-white truncate font-medium text-xs sm:text-sm">
                                          {title}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                          {item.quantity} dona × {formatPrice(item.price)}
                                        </p>
                                      </div>
                                    </div>

                                    <span className="font-bold text-white text-xs sm:text-sm flex-shrink-0">
                                      {formatPrice(item.quantity * item.price)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {order.address && (
                              <div className="pt-2 text-xs font-mono text-zinc-400 border-t border-white/5">
                                <span className="text-zinc-500">Yetkazish manzili: </span>
                                <span className="text-white">{order.address}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <TelegramLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
