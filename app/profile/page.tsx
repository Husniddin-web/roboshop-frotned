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
  FiPhone,
  FiAtSign,
  FiShield,
  FiCopy,
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

  const copyToClipboard = (text: string, label: string) => {
    triggerHaptic("light");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast.success(`${label} nusxalandi`);
    }
  };

  const toggleExpand = (id: string) => {
    triggerHaptic("light");
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <Header />

      <main className="max-w-xl md:max-w-3xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 md:pt-24 pb-28">
        {/* Top Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-4 text-xs font-mono text-zinc-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-amber-400 transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Bosh sahifa</span>
          </Link>

          {isAuthenticated && user && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold transition-all text-xs"
            >
              <FiLogOut size={13} />
              <span>Chiqish</span>
            </button>
          )}
        </div>

        {!isAuthenticated || !user ? (
          /* Unauthenticated State Card */
          <div className="my-8 p-6 sm:p-8 rounded-3xl bg-[#0f1422]/90 border border-white/10 text-center space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#229ED9] to-[#0088cc] flex items-center justify-center text-white mx-auto shadow-xl shadow-[#0088cc]/25">
              <FaTelegramPlane size={38} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                Telegram Profilingizga Kiring
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Buyurtmalarni kuzatish, xaridlar tarixini ko'rish va veb-saytda parolsiz buyurtma berish uchun hisobingizga kiring.
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
          /* Authenticated Telegram Native Profile Layout */
          <div className="space-y-4">
            {/* Telegram Profile Header Card */}
            <div className="rounded-3xl bg-[#0e1322]/90 border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden">
              {/* Top ambient glow */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#0088cc]/15 blur-3xl rounded-full pointer-events-none" />

              {/* Centered Large Avatar */}
              <div className="relative mb-3">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.firstName || "Avatar"}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#0088cc]/30 shadow-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#229ED9] to-[#0088cc] text-white font-bold text-3xl flex items-center justify-center ring-4 ring-[#0088cc]/30 shadow-2xl font-mono">
                    {(user.firstName?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0088cc] border-2 border-[#0e1322] flex items-center justify-center text-white text-[11px] shadow">
                  <FaTelegramPlane />
                </div>
              </div>

              {/* User Full Name */}
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {user.firstName} {user.lastName || ""}
              </h1>

              {/* Username or Telegram ID */}
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {user.username ? `@${user.username}` : `Telegram ID: ${user.telegramId}`}
              </p>

              {/* Status pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 text-[11px] font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telegram hisob ulangan</span>
              </div>
            </div>

            {/* Telegram Info List Card (Phone, Username, ID) */}
            <div className="rounded-3xl bg-[#0e1322]/80 border border-white/10 p-2 sm:p-3 shadow-xl backdrop-blur-md space-y-1">
              {/* Phone number row */}
              <div
                onClick={() =>
                  user.phoneNumber &&
                  copyToClipboard(user.phoneNumber, "Telefon raqam")
                }
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <FiPhone size={16} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                      Telefon raqam
                    </p>
                    <p className="text-sm font-mono font-bold text-white truncate">
                      {user.phoneNumber || "Kiritilmagan"}
                    </p>
                  </div>
                </div>
                {user.phoneNumber && (
                  <FiCopy size={14} className="text-zinc-500 hover:text-white" />
                )}
              </div>

              {/* Username row */}
              {user.username && (
                <div
                  onClick={() =>
                    copyToClipboard(`@${user.username}`, "Username")
                  }
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border-t border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center flex-shrink-0">
                      <FiAtSign size={16} />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                        Username
                      </p>
                      <p className="text-sm font-mono font-bold text-white truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <FiCopy size={14} className="text-zinc-500 hover:text-white" />
                </div>
              )}

              {/* Telegram ID row */}
              <div
                onClick={() =>
                  copyToClipboard(String(user.telegramId), "Telegram ID")
                }
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border-t border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <FiShield size={16} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                      Telegram ID
                    </p>
                    <p className="text-sm font-mono font-bold text-white truncate">
                      {user.telegramId}
                    </p>
                  </div>
                </div>
                <FiCopy size={14} className="text-zinc-500 hover:text-white" />
              </div>
            </div>

            {/* Orders Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-amber-400" size={18} />
                  <h2 className="text-sm sm:text-base font-bold font-mono text-white">
                    Buyurtmalar tarixi
                  </h2>
                </div>
                <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {orders.length} ta
                </span>
              </div>

              {/* Order List */}
              {isOrdersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#0e1322]/50 border border-white/5">
                  <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-zinc-400">
                    Buyurtmalar yuklanmoqda...
                  </span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-10 text-center rounded-3xl bg-[#0e1322]/70 border border-white/10 p-6 space-y-3 shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 mx-auto">
                    <FiPackage size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-mono">
                      Hozircha buyurtmalar yo'q
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Katalogdan kerakli mahsulotlarni tanlab, buyurtma bering
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-black font-bold font-mono text-xs hover:bg-amber-300 transition-colors shadow"
                  >
                    <span>Katalogga o'tish</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((order) => {
                    const status =
                      statusConfig[order.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-[#0e1322]/80 border border-white/10 overflow-hidden transition-all shadow-md"
                      >
                        {/* Order Header Row */}
                        <div
                          onClick={() => toggleExpand(order.id)}
                          className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none active:bg-white/5"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-mono font-bold text-white">
                                #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${status.bg} ${status.color} ${status.border}`}
                              >
                                <StatusIcon size={10} />
                                <span>{status.label}</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                              <FiCalendar size={11} />
                              <span>{formatDate(order.createdAt)}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 block">
                                {formatPrice(order.totalAmount)}
                              </span>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                {order.orderItems?.length || 0} ta mahsulot
                              </p>
                            </div>
                            <div className="p-1 rounded-lg bg-white/5 text-zinc-400">
                              {isExpanded ? (
                                <FiChevronUp size={14} />
                              ) : (
                                <FiChevronDown size={14} />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Details Body */}
                        {isExpanded && (
                          <div className="p-4 border-t border-white/10 bg-black/50 space-y-3 animate-in fade-in duration-150">
                            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                              Buyurtma tarkibi:
                            </h4>

                            <div className="space-y-2">
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
                                    className="flex items-center justify-between gap-3 text-xs font-mono py-1.5 border-b border-white/5 last:border-none"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {fullImg ? (
                                        <img
                                          src={fullImg}
                                          alt={title}
                                          className="w-10 h-10 rounded-lg object-cover bg-zinc-800 flex-shrink-0 border border-white/10"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 flex-shrink-0">
                                          <FiPackage size={14} />
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-white truncate font-medium text-xs">
                                          {title}
                                        </p>
                                        <p className="text-[10px] text-zinc-400">
                                          {item.quantity} dona × {formatPrice(item.price)}
                                        </p>
                                      </div>
                                    </div>

                                    <span className="font-bold text-white text-xs flex-shrink-0">
                                      {formatPrice(item.quantity * item.price)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {order.address && (
                              <div className="pt-2 text-[11px] font-mono text-zinc-400 border-t border-white/5">
                                <span className="text-zinc-500">Manzil: </span>
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
