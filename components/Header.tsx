"use client";
import type React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { toggleCart } from "@/lib/features/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useCategory } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryIcon } from "@/lib/categoryIcons";

const Motion: any = motion;



function ArduinoLogo() {
  return (
    <Motion.div
      className="flex items-center space-x-2 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Motion.svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        className="text-yellow-400 md:w-10 md:h-10"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Motion.circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <Motion.rect
          x="12"
          y="16"
          width="16"
          height="8"
          rx="2"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        <Motion.circle
          cx="16"
          cy="20"
          r="1.5"
          fill="#000000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.3 }}
        />
        <Motion.circle
          cx="24"
          cy="20"
          r="1.5"
          fill="#000000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, duration: 0.3 }}
        />
      </Motion.svg>
      <Motion.span
        className="text-lg md:text-xl font-extrabold hidden sm:block tracking-tight text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Robo<span className="text-amber-400">Shop</span>.uz
      </Motion.span>
    </Motion.div>
  );
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: categories = [] } = useCategory();

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const setCurrentLanguage = (lang: string) => i18n.changeLanguage(lang);
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [currentLanguage, queryClient]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery.trim()}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowMobileSearch(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowCategories(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f17]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Main header row */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <ArduinoLogo />
            </Link>

            {/* Desktop Search - Hidden on mobile */}
            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-md flex-1 hidden md:block"
            >
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-xl border border-white/10 bg-white/5 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-400/50 text-sm transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <FiSearch size={16} />
              </button>
            </form>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3">
              {/* Category dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 text-zinc-200 hover:text-amber-300 transition-all font-medium text-sm flex items-center gap-1.5"
                >
                  <span>{t("categories")}</span>
                  <FiChevronDown
                    className={`transition-transform ${
                      showCategories ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showCategories && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-64 bg-[#101624] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[60vh] p-2"
                    >
                      {categories.map((category: any) => {
                        const rawName = category.translations?.[0]?.name || "Unnamed";
                        return (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            onClick={() => setShowCategories(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 text-sm rounded-xl transition-colors capitalize group"
                          >
                            {getCategoryIcon(rawName, 15)}
                            <span className="truncate group-hover:text-amber-300 transition-colors">
                              {rawName}
                            </span>
                          </Link>
                        );
                      })}
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language buttons */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
                {["uz", "ru"].map((lang) => {
                  const isActive = currentLanguage === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => setCurrentLanguage(lang)}
                      className={`px-3 py-1 rounded-lg transition-all duration-200 font-bold text-xs uppercase ${
                        isActive
                          ? "bg-amber-400 text-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>

              {/* Cart button */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-xl transition-all duration-200"
              >
                <FiShoppingCart size={18} className="text-amber-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[11px] bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full px-1.5 py-0.2 font-black shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Search Button */}
              <button
                onClick={toggleMobileSearch}
                className={`p-2 rounded transition-colors ${
                  showMobileSearch
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                <FiSearch size={20} />
              </button>

              {/* Mobile Cart Button */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 hover:bg-yellow-500/10 rounded transition-colors"
              >
                <FiShoppingCart size={20} className="text-yellow-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-yellow-400 text-black rounded-full px-1.5 py-0.5 font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded transition-colors ${
                  showMobileMenu
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showMobileSearch && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 pt-3 border-t border-yellow-500/20"
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 placeholder-yellow-300 focus:outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <FiSearch size={18} />
                  </button>
                </form>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <Motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 md:hidden flex flex-col"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              }}
            >
              <div className="p-4 border-b border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-yellow-400 font-bold text-lg font-mono">
                    Menu
                  </h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {/* Categories Section */}
                <div>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full flex items-center justify-between p-3 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                  >
                    <span className="font-mono font-semibold">
                      {t("categories")}
                    </span>
                    <FiChevronDown
                      className={`transition-transform ${
                        showCategories ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showCategories && (
                      <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1 overflow-y-auto max-h-[50vh] pr-1"
                      >
                        {categories.map((category: any) => {
                          const rawName = category.translations?.[0]?.name || "Unnamed";
                          return (
                            <Link
                              key={category.id}
                              href={`/products?category=${category.id}`}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2.5 px-3.5 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 text-sm rounded-xl transition-all capitalize"
                            >
                              {getCategoryIcon(rawName, 15)}
                              <span className="truncate">{rawName}</span>
                            </Link>
                          );
                        })}
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Selection */}
                <div>
                  <h3 className="text-yellow-400 font-mono font-semibold mb-2">
                    Language
                  </h3>
                  <div className="flex gap-2">
                    {["uz", "ru"].map((lang) => {
                      const isActive = currentLanguage === lang;
                      return (
                        <button
                          key={lang}
                          onClick={() => {
                            setCurrentLanguage(lang);
                            closeMobileMenu();
                          }}
                          className={`flex-1 px-4 py-2 rounded border transition-all duration-300 font-semibold text-sm ${
                            isActive
                              ? "bg-yellow-400 text-black border-yellow-400"
                              : "bg-transparent text-yellow-300 border-yellow-300 hover:bg-yellow-400 hover:text-black"
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
