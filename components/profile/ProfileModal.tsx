"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { customerLogout } from "@/lib/features/userAuthSlice";
import { useMyOrders } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/telegram";
import {
  FiX,
  FiUser,
  FiPackage,
  FiPhone,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userAuth);
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data: myOrdersData, isLoading: isOrdersLoading } = useMyOrders(
    user?.telegramId ? String(user.telegramId) : undefined,
    user?.phoneNumber || undefined
  );

  if (!isOpen || !user) return null;

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
    onClose();
  };

  const toggleExpandOrder = (id: string) => {
    triggerHaptic("light");
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const userInitial =
    (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-[#0d0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.firstName || "Avatar"}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-black font-bold text-lg flex items-center justify-center shadow-md">
                  {userInitial}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0088cc] flex items-center justify-center text-white text-[9px] shadow">
                <FaTelegramPlane />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white">
                  {user.firstName} {user.lastName || ""}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {user.username ? `@${user.username}` : `ID: ${user.telegramId}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/20">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("orders");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold font-mono transition-all ${
              activeTab === "orders"
                ? "bg-amber-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FiPackage size={15} />
            <span>Mening buyurtmalarim ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic("selection");
              setActiveTab("details");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold font-mono transition-all ${
              activeTab === "details"
                ? "bg-amber-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FiUser size={15} />
            <span>Profil ma'lumotlari</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Tab 1: Orders */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {isOrdersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-zinc-500">
                    Buyurtmalar yuklanmoqda...
                  </span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 mx-auto">
                    <FiPackage size={32} />
                  </div>
                  <p className="text-sm font-medium text-zinc-300">
                    Hozircha buyurtmalar mavjud emas
                  </p>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Katalogdan o'zingizga ma'qul bo'lgan mahsulotlarni tanlab, buyurtma bering
                  </p>
                </div>
              ) : (
                orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all hover:border-white/20"
                    >
                      {/* Order Summary Row */}
                      <div
                        onClick={() => toggleExpandOrder(order.id)}
                        className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              #{order.id.slice(-6).toUpperCase()}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${status.bg} ${status.color} ${status.border}`}
                            >
                              <StatusIcon size={10} />
                              <span>{status.label}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                            <span className="flex items-center gap-1">
                              <FiCalendar size={11} />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-amber-400">
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

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3 animate-in fade-in duration-150">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                            Buyurtma tarkibi:
                          </p>
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
                                        className="w-9 h-9 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                                      />
                                    ) : (
                                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 flex-shrink-0">
                                        <FiPackage size={14} />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-white truncate font-medium">
                                        {title}
                                      </p>
                                      <p className="text-[11px] text-zinc-500">
                                        {item.quantity} dona × {formatPrice(item.price)}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-white flex-shrink-0">
                                    {formatPrice(item.quantity * item.price)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {order.address && (
                            <div className="pt-2 text-[11px] font-mono text-zinc-400">
                              <span className="text-zinc-500">Manzil: </span>
                              {order.address}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Profile Details */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Ism:</span>
                  <span className="text-white font-medium">
                    {user.firstName || "Kiritilmagan"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Familiya:</span>
                  <span className="text-white font-medium">
                    {user.lastName || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Telegram Username:</span>
                  <span className="text-[#229ED9] font-medium">
                    {user.username ? `@${user.username}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Telegram ID:</span>
                  <span className="text-white font-medium">{user.telegramId}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Telefon:</span>
                  <span className="text-white font-medium">
                    {user.phoneNumber || "Buyurtma berilganda kiritiladi"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold font-mono text-xs flex items-center justify-center gap-2 border border-red-500/20 transition-all active:scale-98"
              >
                <FiLogOut size={14} />
                <span>Hisobdan chiqish (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
