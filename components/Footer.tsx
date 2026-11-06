"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Cpu, Phone, Send, Mail, MapPin, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  return (
    <footer className="relative bg-[#070a10] text-zinc-400 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1: Brand (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/20">
                <Cpu size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Robo<span className="text-amber-400">Shop</span>.uz
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {t("footer.description") ||
                "Arduino, mikrokontrollerlar, sensorlar va robototexnika qismlarining O'zbekistondagi eng ishonchli do'koni."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>100% Sifat kafolati</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                <Truck size={13} className="text-amber-400" />
                <span>Tezkor yetkazish</span>
              </div>
            </div>
          </div>

          {/* Col 2: Katalog */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {isUz ? "Katalog" : "Каталог"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  {isUz ? "Barcha mahsulotlar" : "Все товары"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  {isUz ? "Arduino platalari" : "Платы Arduino"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  {isUz ? "Datchik va Sensorlar" : "Датчики и Сенсоры"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  {isUz ? "Robototexnika to'plamlari" : "Наборы робототехники"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ma'lumot */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {isUz ? "Ma'lumotlar" : "Информация"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#about" className="hover:text-amber-400 transition-colors">
                  {t("about.us") || "Biz haqimizda"}
                </Link>
              </li>
              <li>
                <Link href="/#academy" className="hover:text-amber-400 transition-colors">
                  {isUz ? "RoboShop Akademiyasi" : "RoboShop Академия"}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-amber-400 transition-colors">
                  {t("contact.info") || "Do'kon manzili"}
                </Link>
              </li>
              <li>
                <Link href="/shikoyat" className="hover:text-amber-400 transition-colors">
                  {isUz ? "Shikoyat va takliflar" : "Жалобы и предложения"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Aloqa */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {isUz ? "Tezkor aloqa" : "Связь с нами"}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:+998917979992"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Phone size={14} className="text-amber-400" />
                  <span>+998 (91) 797-99-92</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/roboshop_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
                >
                  <Send size={14} className="text-cyan-400" />
                  <span>@roboshop_admin</span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin size={14} className="text-purple-400 flex-shrink-0" />
                  <span>Toshkent sh., Bunyodkor sh.</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} RoboShop.uz. {isUz ? "Barcha huquqlar himoyalangan." : "Все права защищены."}</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-amber-400 font-semibold">RoboShop Tech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

