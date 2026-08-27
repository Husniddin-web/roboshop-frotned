"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { toggleCart } from "@/lib/features/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useCategory, useAdminProducts } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  PackageSearch,
  Loader2,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import TelegramLoginModal from "./auth/TelegramLoginModal";
import ProfileModal from "./profile/ProfileModal";

const Motion: any = motion;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const POPULAR_SEARCHES = [
  "Arduino Uno",
  "ESP32",
  "SG90",
  "HC-SR04",
  "L298N",
  "DHT22",
  "OLED",
  "Starter Kit",
];

function ArduinoLogo() {
  return (
    <Motion.div
      className="flex items-center space-x-2 cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Motion.svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        className="text-amber-400 md:w-9 md:h-9"
        animate={{ rotate: [0, 4, -4, 0] }}
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
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <Motion.rect
          x="12"
          y="16"
          width="16"
          height="8"
          rx="2"
          fill="currentColor"
        />
        <Motion.circle cx="16" cy="20" r="1.5" fill="#000000" />
        <Motion.circle cx="24" cy="20" r="1.5" fill="#000000" />
      </Motion.svg>
      <Motion.span
        className="text-lg md:text-xl font-extrabold hidden sm:block tracking-tight text-white"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Robo<span className="text-amber-400">Shop</span>.uz
      </Motion.span>
    </Motion.div>
  );
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isAuthenticated: isUserAuth, user: customerUser } = useSelector(
    (state: RootState) => state.userAuth
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { data: categories = [] } = useCategory();

  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";
  const currentLanguage = i18n.language;
  const setCurrentLanguage = (lang: string) => i18n.changeLanguage(lang);
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Real-time products query
  const { data: searchProductsData, isLoading: isSearchLoading } =
    useAdminProducts({
      search: debouncedQuery,
      page: 1,
    });

  const searchResults = debouncedQuery ? searchProductsData?.data || [] : [];
  const totalResultsFound = searchProductsData?.meta?.total || 0;

  // Invalidate queries on language switch
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [currentLanguage, queryClient]);

  // Click outside listener for desktop search popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus mobile input on open
  useEffect(() => {
    if (showMobileSearch && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setShowMobileSearch(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    setSearchQuery("");
  };

  const handlePopularSearchClick = (keyword: string) => {
    setSearchQuery(keyword);
    setDebouncedQuery(keyword);
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileMenu(false);
    if (!showMobileSearch) {
      setSearchQuery("");
    }
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0b0f17]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Main header row */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <ArduinoLogo />
            </Link>

            {/* Desktop Search with Live Dropdown */}
            <div
              ref={desktopSearchRef}
              className="relative w-full max-w-lg flex-1 hidden md:block"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t("search.placeholder") || "Arduino, datchik, motorlarni qidirish..."}
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.08] text-sm transition-all shadow-inner"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    <FiX size={15} />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  <FiSearch size={16} />
                </button>
              </form>

              {/* Desktop Live Search Popover */}
              <AnimatePresence>
                {isSearchFocused && (
                  <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-[#0c101c]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* State 1: Typing & Searching */}
                    {debouncedQuery.length > 0 ? (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10 text-xs text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            {isSearchLoading ? (
                              <Loader2 size={13} className="animate-spin text-amber-400" />
                            ) : (
                              <Sparkles size={13} className="text-amber-400" />
                            )}
                            <span>"{debouncedQuery}" bo'yicha natijalar</span>
                          </span>
                          {!isSearchLoading && (
                            <span className="font-semibold text-amber-400">
                              {totalResultsFound} {t("search.results_count") || "ta topildi"}
                            </span>
                          )}
                        </div>

                        {/* Results list */}
                        {isSearchLoading ? (
                          <div className="space-y-2 p-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-xl bg-white/5 animate-pulse"
                              >
                                <div className="w-11 h-11 rounded-lg bg-white/10 flex-shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                  <div className="h-3.5 bg-white/10 rounded w-3/4" />
                                  <div className="h-3 bg-white/5 rounded w-1/3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                            {searchResults.slice(0, 5).map((product: any) => {
                              const trans = product.translations?.[0];
                              const imgUrl = product.images?.[0]?.url
                                ? `${BASE_URL}/uploads/${product.images[0].url}`
                                : "/placeholder.svg";

                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => handleSelectProduct(product.id)}
                                  className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden relative flex-shrink-0">
                                      <Image
                                        src={imgUrl}
                                        alt={trans?.name || "Product"}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                                        {trans?.name || "Mahsulot"}
                                      </h4>
                                      <span className="text-[11px] text-zinc-400 truncate block">
                                        {product.category?.translations?.[0]?.name || "Arduino"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right flex-shrink-0 pl-2">
                                    <span className="text-xs sm:text-sm font-extrabold text-amber-400">
                                      {formatPrice(Number(product.price))}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-6 px-4 text-center">
                            <PackageSearch size={28} className="text-zinc-500 mx-auto mb-2" />
                            <p className="text-xs text-zinc-400">
                              {t("search.no_results") || "Mahsulot topilmadi"}
                            </p>
                          </div>
                        )}

                        {/* View all button */}
                        {searchResults.length > 0 && (
                          <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="w-full mt-2 pt-2.5 pb-1 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <span>{t("search.view_all") || "Barcha natijalarni ko'rish"} ({totalResultsFound})</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    ) : (
                      /* State 2: Empty input -> Popular searches */
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                          <TrendingUp size={14} className="text-amber-400" />
                          <span>{t("search.popular") || "Ommabop qidiruvlar"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_SEARCHES.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handlePopularSearchClick(tag)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-xs text-zinc-300 transition-all"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
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
                title="Savat"
              >
                <FiShoppingCart size={18} className="text-amber-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[11px] bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full px-1.5 py-0.2 font-black shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Profile / Telegram Login button */}
              {isUserAuth && customerUser ? (
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 text-zinc-200 transition-all text-xs font-mono"
                >
                  {customerUser.photoUrl ? (
                    <img
                      src={customerUser.photoUrl}
                      alt={customerUser.firstName || "User"}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center text-[10px]">
                      {(customerUser.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate font-semibold">
                    {customerUser.firstName || "Profil"}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] hover:text-white transition-all text-xs font-mono font-bold"
                >
                  <FaTelegramPlane size={13} />
                  <span>Kirish</span>
                </button>
              )}
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Search Button */}
              <button
                onClick={toggleMobileSearch}
                className={`p-2.5 rounded-xl border transition-all ${
                  showMobileSearch
                    ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                    : "bg-white/5 border-white/10 text-amber-400 hover:bg-white/10"
                }`}
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>

              {/* Mobile Cart Button */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                aria-label="Cart"
              >
                <FiShoppingCart size={18} className="text-amber-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full px-1.5 py-0.2 font-bold shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`p-2.5 rounded-xl border transition-colors ${
                  showMobileMenu
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
                aria-label="Menu"
              >
                {showMobileMenu ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN LIVE SEARCH OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showMobileSearch && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#070a12] flex flex-col md:hidden"
          >
            {/* Top Search Input Bar */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0c101c]/95">
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                aria-label="Back"
              >
                <FiArrowLeft size={20} />
              </button>

              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder={t("search.placeholder") || "Arduino, datchik, motorlar..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-amber-400/40 bg-white/5 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-400"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 p-1"
                  >
                    <FiX size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400"
                  >
                    <FiSearch size={16} />
                  </button>
                )}
              </form>
            </div>

            {/* Mobile Results Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {debouncedQuery.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3 px-1">
                    <span className="flex items-center gap-1.5">
                      {isSearchLoading ? (
                        <Loader2 size={13} className="animate-spin text-amber-400" />
                      ) : (
                        <Sparkles size={13} className="text-amber-400" />
                      )}
                      <span>"{debouncedQuery}" natijalari</span>
                    </span>
                    {!isSearchLoading && (
                      <span className="font-semibold text-amber-400">
                        {totalResultsFound} ta topildi
                      </span>
                    )}
                  </div>

                  {isSearchLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 animate-pulse"
                        >
                          <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/5 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((product: any) => {
                        const trans = product.translations?.[0];
                        const imgUrl = product.images?.[0]?.url
                          ? `${BASE_URL}/uploads/${product.images[0].url}`
                          : "/placeholder.svg";

                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product.id)}
                            className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-98 transition-all text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden relative flex-shrink-0">
                                <Image
                                  src={imgUrl}
                                  alt={trans?.name || "Product"}
                                  fill
                                  className="object-contain p-1.5"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                                  {trans?.name || "Mahsulot"}
                                </h4>
                                <span className="text-xs text-zinc-400 mt-0.5 block">
                                  {product.category?.translations?.[0]?.name || "Arduino"}
                                </span>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0 pl-2">
                              <span className="text-sm font-extrabold text-amber-400 block">
                                {formatPrice(Number(product.price))}
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {/* Mobile View All Button */}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full mt-4 btn btn-primary py-3 text-sm font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                      >
                        <span>{t("search.view_all") || "Barcha natijalarni ko'rish"} ({totalResultsFound})</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 px-4 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-amber-400">
                        <PackageSearch size={28} />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {t("search.no_results") || "Mahsulot topilmadi"}
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-4">
                        Boshqa kalit so'z bilan izlab ko'ring
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Mobile Empty -> Popular Searches */
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
                    <TrendingUp size={15} className="text-amber-400" />
                    <span>{t("search.popular") || "Ommabop qidiruvlar"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {POPULAR_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handlePopularSearchClick(tag)}
                        className="px-4 py-2 rounded-xl bg-white/5 active:bg-amber-400 active:text-black border border-white/10 text-xs font-medium text-zinc-300 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <Motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 md:hidden flex flex-col bg-[#0c101c] border-l border-white/10 shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-white font-extrabold text-base tracking-tight">
                  Robo<span className="text-amber-400">Shop</span> Menyusi
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-4 space-y-5 overflow-y-auto flex-1">
                {/* Categories Section */}
                <div>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:text-amber-400 transition-colors"
                  >
                    <span className="font-semibold text-sm">
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
                        className="mt-2 space-y-1 overflow-y-auto max-h-[45vh] pr-1"
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

                {/* User Profile / Login row in Mobile Menu */}
                <div className="pt-2 border-t border-white/10">
                  {isUserAuth && customerUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {customerUser.photoUrl ? (
                          <img
                            src={customerUser.photoUrl}
                            alt={customerUser.firstName || "User"}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center text-xs">
                            {(customerUser.firstName?.[0] || "U").toUpperCase()}
                          </div>
                        )}
                        <div className="text-left truncate">
                          <p className="font-bold truncate">{customerUser.firstName}</p>
                          <p className="text-[10px] text-zinc-500">Mening profilim</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-amber-400 font-bold">Ochish →</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white font-bold font-mono text-xs shadow-lg shadow-[#0088cc]/20 transition-all"
                    >
                      <FaTelegramPlane size={15} />
                      <span>Telegram orqali kirish</span>
                    </button>
                  )}
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Telegram Auth Modals */}
      <TelegramLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;

