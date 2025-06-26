"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/features/authSlice";
import {
  FiLogOut,
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
import { motion, AnimatePresence } from "framer-motion";

type TabType = "products" | "categories" | "orders" | "content" | "botuser";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [searchInput, setSearchInput] = useState("");
  const { admin } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchInput(initialSearch);
  }, [searchParams]);

  useEffect(() => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`?${params.toString()}`);
  }, [activeTab]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const tabs = [
    { id: "products" as TabType, label: "Products", icon: FiPackage },
    { id: "categories" as TabType, label: "Categories", icon: FiFolder },
    { id: "orders" as TabType, label: "Orders", icon: FiBarChart },
    { id: "content" as TabType, label: "Content", icon: FiGlobe },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsManager search={searchInput} />;
      case "categories":
        return <CategoriesManager search={searchInput} />;
      case "orders":
        return <OrdersAnalytics />;
      case "content":
        return <ContentManager />;
      default:
        return <ProductsManager search={searchInput} />;
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
      <motion.header
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
              color: "#000000",
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <FiSettings size={20} />
          </motion.div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Admin Dashboard
          </h1>
        </motion.div>

        <motion.div
          className="flex items-center gap-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Search Bar */}
          <div className="relative">
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "#a0a0a0" }}
            >
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products, categories..."
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
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

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
          <motion.button
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
            whileHover={{
              scale: 1.05,
              background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
              color: "#000000",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut size={16} />
            Logout
          </motion.button>
        </motion.div>
      </motion.header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <motion.nav
          className="sticky top-20 h-[calc(100vh-5rem)]"
          style={{
            width: "280px",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            borderRight: "2px solid rgba(255, 255, 255, 0.1)",
            padding: "2rem 0",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.2)",
          }}
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
              Management
            </h2>
          </div>

          <div className="space-y-2 px-4">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor:
                    activeTab === tab.id
                      ? undefined
                      : "rgba(255, 255, 255, 0.05)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon size={20} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ background: "#000000" }}
                    layoutId="activeIndicator"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
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
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
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
