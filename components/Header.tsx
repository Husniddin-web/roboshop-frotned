"use client";
import type React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiX,
  FiGrid,
  FiHome,
  FiPackage,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { toggleCart } from "@/lib/features/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useCategory } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

/* ── Logo ────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <motion.div
        className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center"
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-black font-black text-sm">AS</span>
      </motion.div>
      <motion.span
        className="font-black text-base hidden sm:block"
        style={{
          background: "linear-gradient(90deg,#facc15,#f59e0b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: '"Courier New", monospace',
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Arduino Shop
      </motion.span>
    </Link>
  );
}

/* ── Search bar ──────────────────────────────────────────── */
function SearchBar({
  value,
  onChange,
  onSubmit,
  autoFocus = false,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  autoFocus?: boolean;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
        focused
          ? "border-yellow-400/80 bg-yellow-400/8 shadow-[0_0_0_3px_rgba(250,204,21,0.12)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <FiSearch
        size={16}
        className={`flex-shrink-0 transition-colors ${focused ? "text-yellow-400" : "text-gray-500"}`}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full font-mono"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <FiX size={14} />
        </button>
      )}
    </form>
  );
}

/* ── Category chip row ───────────────────────────────────── */
function CategoryChips({
  categories,
  onSelect,
}: {
  categories: any[];
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  if (!categories.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <motion.button
        onClick={() => {
          setActive(null);
          router.push("/products");
        }}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold font-mono border transition-all ${
          active === null
            ? "bg-yellow-400 text-black border-yellow-400"
            : "bg-white/5 text-gray-400 border-white/10 hover:border-yellow-400/40 hover:text-yellow-300"
        }`}
        whileTap={{ scale: 0.93 }}
      >
        Barchasi
      </motion.button>
      {categories.map((cat: any) => (
        <motion.button
          key={cat.id}
          onClick={() => {
            setActive(cat.id);
            onSelect(cat.id);
          }}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold font-mono border transition-all ${
            active === cat.id
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-white/5 text-gray-400 border-white/10 hover:border-yellow-400/40 hover:text-yellow-300"
          }`}
          whileTap={{ scale: 0.93 }}
        >
          {cat.translations[0]?.name || "—"}
        </motion.button>
      ))}
    </div>
  );
}

/* ── Lang pill ───────────────────────────────────────────── */
function LangSwitch({
  current,
  onChange,
}: {
  current: string;
  onChange: (l: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
      {["uz", "ru"].map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono transition-all ${
            current === l
              ? "bg-yellow-400 text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ── Main Header ─────────────────────────────────────────── */
const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data: categories = [] } = useCategory();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const queryClient = useQueryClient();

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  /* scroll glassmorphism */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category"] });
  }, [currentLanguage, queryClient]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleCategorySelect = (id: string) => {
    router.push(`/products?category=${id}`);
  };

  /* hide header on admin pages */
  if (pathname?.startsWith("/admin")) return null;

  const showCategoryRow = pathname === "/" || pathname === "/products";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-[#111]/80 border-b border-white/8 shadow-xl"
            : "bg-[#111]/60 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* ── Main row ── */}
          <div className="flex items-center gap-3 h-14">
            <Logo />

            {/* Desktop search — expands */}
            <div className="hidden md:flex flex-1 max-w-sm">
              <div className="w-full">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                  placeholder={t("search.placeholder")}
                />
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1 md:hidden" />

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Mobile search toggle */}
              <motion.button
                className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
                onClick={() => setSearchOpen((p) => !p)}
                whileTap={{ scale: 0.9 }}
              >
                {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </motion.button>

              {/* Lang */}
              <div className="hidden sm:block">
                <LangSwitch
                  current={currentLanguage}
                  onChange={(l) => i18n.changeLanguage(l)}
                />
              </div>

              {/* Cart */}
              <motion.button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 rounded-xl text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <FiShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-yellow-400 text-black text-[10px] font-black rounded-full px-1"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* ── Mobile search expand ── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden pb-3"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                  autoFocus
                  placeholder={t("search.placeholder")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Category chips ── */}
          {showCategoryRow && categories.length > 0 && (
            <div className="pb-2.5 -mx-1 px-1">
              <CategoryChips
                categories={categories}
                onSelect={handleCategorySelect}
              />
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Bottom Nav (Telegram Mini App uchun) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div
          className="flex items-center justify-around px-4 py-2 border-t border-white/8"
          style={{ background: "rgba(17,17,17,0.92)", backdropFilter: "blur(20px)" }}
        >
          {[
            { href: "/", icon: FiHome, label: "Bosh sahifa" },
            { href: "/products", icon: FiPackage, label: "Mahsulotlar" },
            { href: "/products", icon: FiGrid, label: "Kategoriya", isCart: false },
          ].map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
              >
                <motion.div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-yellow-400/15 text-yellow-400"
                      : "text-gray-500"
                  }`}
                  whileTap={{ scale: 0.85 }}
                >
                  <Icon size={20} />
                </motion.div>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isActive ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Cart in bottom nav */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <motion.div
              className={`p-1.5 rounded-xl transition-colors relative ${
                cartCount > 0
                  ? "bg-yellow-400/15 text-yellow-400"
                  : "text-gray-500"
              }`}
              whileTap={{ scale: 0.85 }}
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-yellow-400 text-black text-[9px] font-black rounded-full px-0.5">
                  {cartCount}
                </span>
              )}
            </motion.div>
            <span
              className={`text-[10px] font-mono font-semibold ${
                cartCount > 0 ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              Savat
            </span>
          </button>

          {/* Lang in bottom nav */}
          <div className="flex flex-col items-center gap-0.5 px-3 py-1">
            <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
              {["uz", "ru"].map((l) => (
                <button
                  key={l}
                  onClick={() => i18n.changeLanguage(l)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black font-mono transition-all ${
                    currentLanguage === l
                      ? "bg-yellow-400 text-black"
                      : "text-gray-500"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono font-semibold text-gray-600">Til</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
