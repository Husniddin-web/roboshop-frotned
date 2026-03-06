"use client";

import { useAdminDashboardSummary } from "@/lib/api";
import {
  FiPackage,
  FiFolder,
  FiShoppingBag,
  FiClock,
  FiSun,
  FiDollarSign,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const cardBaseStyle =
  "rounded-lg p-5 border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]";

export default function DashboardOverview() {
  const { t } = useTranslation();
  const { data, isLoading } = useAdminDashboardSummary();

  if (isLoading) {
    return (
      <div className="rounded-lg p-6 border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <p className="text-white font-mono">{t("admin.dashboard.loading")}</p>
      </div>
    );
  }

  const stats = [
    {
      title: t("admin.stats.total.products"),
      value: data?.totalProducts ?? 0,
      icon: FiPackage,
    },
    {
      title: t("admin.stats.active.products"),
      value: data?.activeProducts ?? 0,
      icon: FiPackage,
    },
    {
      title: t("categories"),
      value: data?.totalCategories ?? 0,
      icon: FiFolder,
    },
    {
      title: t("admin.stats.total.orders"),
      value: data?.totalOrders ?? 0,
      icon: FiShoppingBag,
    },
    {
      title: t("pending.orders"),
      value: data?.pendingOrders ?? 0,
      icon: FiClock,
    },
    {
      title: t("admin.stats.today.orders"),
      value: data?.todayOrders ?? 0,
      icon: FiSun,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase">
          {t("dashboard")}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {t("admin.dashboard.overview")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => (
          <div key={item.title} className={cardBaseStyle}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-gray-400 font-mono">{item.title}</p>
              <item.icon className="text-yellow-400" size={18} />
            </div>
            <p className="text-3xl font-bold text-white font-mono">{item.value}</p>
          </div>
        ))}
      </div>

      <div className={`${cardBaseStyle} flex items-center justify-between`}>
        <div>
          <p className="text-sm text-gray-400 font-mono">{t("total.revenue")}</p>
          <p className="text-3xl font-bold text-green-400 font-mono">
            {(Number(data?.totalRevenue || 0)).toLocaleString()} UZS
          </p>
        </div>
        <FiDollarSign className="text-green-400" size={28} />
      </div>
    </div>
  );
}
