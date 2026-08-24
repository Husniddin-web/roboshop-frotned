"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/features/authSlice";
import { useTranslation } from "react-i18next";
import {
  FiLogOut,
  FiGrid,
  FiPackage,
  FiFolder,
  FiBarChart,
  FiGlobe,
  FiSearch,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import OrdersAnalytics from "./OrdersAnalytics";
import ContentManager from "./ContentManager";
import DashboardOverview from "./DashboardOverview";

export type TabType = "dashboard" | "products" | "categories" | "orders";

const tabRouteMap: Record<TabType, string> = {
  dashboard: "/admin",
  products: "/admin/products",
  categories: "/admin/categories",
  orders: "/admin/orders",
};

export default function AdminDashboard({
  initialTab = "dashboard",
}: {
  initialTab?: TabType;
}) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchInput, setSearchInput] = useState("");
  const { admin } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    if (initialSearch && !searchInput) {
      setSearchInput(initialSearch);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentSearch = currentParams.get("search") || "";
      if (currentSearch !== searchInput) {
        if (searchInput) {
          currentParams.set("search", searchInput);
        } else {
          currentParams.delete("search");
        }
        const query = currentParams.toString();
        const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
        window.history.replaceState(null, "", newUrl);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "dashboard") {
      params.delete("search");
    }
    const query = params.toString();
    router.push(`${tabRouteMap[tab]}${query ? `?${query}` : ""}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const tabs = [
    { id: "dashboard" as TabType, label: t("dashboard"), icon: FiGrid },
    { id: "products" as TabType, label: t("products"), icon: FiPackage },
    {
      id: "categories" as TabType,
      label: t("categories"),
      icon: FiFolder,
    },
    { id: "orders" as TabType, label: t("orders"), icon: FiBarChart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "products":
        return <ProductsManager search={searchInput} />;
      case "categories":
        return <CategoriesManager search={searchInput} />;
      case "orders":
        return <OrdersAnalytics search={searchInput} />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
              color: "#000000",
            }}
          >
            <FiSettings size={20} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {t("admin.dashboard")}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          {activeTab !== "dashboard" && (
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: "#a0a0a0" }}
              >
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder={t("admin.search.placeholder")}
                value={searchInput}
                onChange={handleSearchChange}
                className="rounded-lg transition-all duration-200"
                style={{
                  width: "350px",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontSize: "0.875rem",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ffffff";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(255, 255, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          {/* Admin Info */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
                color: "#000000",
              }}
            >
              <FiUser size={16} />
            </div>
            <span
              className="font-medium"
              style={{
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
            >
              {admin?.fullName || "Admin"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            <FiLogOut size={16} />
            {t("logout")}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav
          className="sticky top-20 h-[calc(100vh-5rem)]"
          style={{
            width: "280px",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            borderRight: "2px solid rgba(255, 255, 255, 0.1)",
            padding: "2rem 0",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="px-6 mb-8">
            <h2
              className="text-sm font-bold mb-4"
              style={{
                color: "#a0a0a0",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {t("management")}
            </h2>
          </div>

          <div className="space-y-2 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="w-full text-left px-4 py-4 flex items-center gap-4 rounded-lg transition-all duration-200"
                style={{
                  border: "none",
                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)"
                      : "transparent",
                  color: activeTab === tab.id ? "#000000" : "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <tab.icon size={20} />
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ background: "#000000" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div
              className="p-4 rounded-lg text-center"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{
                  color: "#a0a0a0",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                }}
              >
                Arduino Shop Admin
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                }}
              >
                v2.0.0
              </p>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div key={activeTab}>{renderContent()}</div>
        </main>
      </div>

      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
            linear-gradient(90deg, rgba(255, 255, 255, 0.005) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.005) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
          zIndex: -1,
        }}
      />
    </div>
  );
}
