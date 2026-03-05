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

const cardBaseStyle =
  "rounded-lg p-5 border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]";

export default function DashboardOverview() {
  const { data, isLoading } = useAdminDashboardSummary();

  if (isLoading) {
    return (
      <div className="rounded-lg p-6 border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <p className="text-white font-mono">Loading dashboard stats...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: FiPackage,
    },
    {
      title: "Active Products",
      value: data?.activeProducts ?? 0,
      icon: FiPackage,
    },
    {
      title: "Categories",
      value: data?.totalCategories ?? 0,
      icon: FiFolder,
    },
    {
      title: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: FiShoppingBag,
    },
    {
      title: "Pending Orders",
      value: data?.pendingOrders ?? 0,
      icon: FiClock,
    },
    {
      title: "Today Orders",
      value: data?.todayOrders ?? 0,
      icon: FiSun,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase">Dashboard</h2>
        <p className="text-sm text-gray-400 mt-1">
          Umumiy admin statistikalari real time ko'rinadi.
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
          <p className="text-sm text-gray-400 font-mono">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400 font-mono">
            {(Number(data?.totalRevenue || 0)).toLocaleString()} UZS
          </p>
        </div>
        <FiDollarSign className="text-green-400" size={28} />
      </div>
    </div>
  );
}
