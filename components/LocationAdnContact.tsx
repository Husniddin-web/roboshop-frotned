"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Phone, Send, Mail, MapPin, Clock, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function LocationAndContact() {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUz = i18n.language === "uz";

  const storeAddress = "Toshkent shahri, Chilonzor tumani, Bunyodkor ko'chasi (Korzinka Bunyodkor yonida)";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(storeAddress);
    setCopied(true);
    showToast.success(t("contact.copied") || "Manzil nusxalandi!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin size={13} />
            <span>{isUz ? "Do'kon & Manzil" : "Магазин & Локация"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t("contact.info")}
          </h2>
          <p className="text-sm text-zinc-400">
            {isUz
              ? "Toshkent shahridagi rasmiy shourumimizga tashrif buyuring yoki to'g'ridan-to'g'ri buyurtma bering"
              : "Посетите наш шоурум в Ташкенте или свяжитесь с нами для быстрой консультации"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Map Frame (7 cols) */}
          <div
            ref={iframeRef}
            className="lg:col-span-7 rounded-2xl overflow-hidden glass-panel border border-white/10 relative min-h-[380px] lg:min-h-[460px] flex flex-col justify-between"
          >
            {/* Top map header overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white">
                  {t("contact.open_now")}: <strong className="text-amber-400">09:00 - 20:00</strong>
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=41.273237,69.201053"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <span>{t("contact.open_map")}</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Map Iframe or Skeleton */}
            {!showMap ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 animate-pulse">
                <MapPin size={32} className="text-amber-400 mb-2 opacity-50" />
                <span className="text-sm font-medium">{t("loading.map") || "Xarita yuklanmoqda..."}</span>
              </div>
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.9356728397393!2d69.20105357567799!3d41.27323760306849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a39be5272f5%3A0x283b29f021a7a880!2sKorzinka%20%E2%80%94%20Bunyodkor!5e1!3m2!1sen!2s!4v1749979869227!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  minHeight: "460px",
                  filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          {/* Right: Contact Hub (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl glass-panel border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                  {isUz ? "Aloqa va Buyurtma" : "Контакты и Заказы"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {isUz ? "Biz bilan bog'laning" : "Свяжитесь с нами"}
              </h3>

              {/* Action Rows */}
              <div className="space-y-4">
                {/* Phone */}
                <a
                  href="tel:+998917979992"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-400 block">{isUz ? "Telefon raqami" : "Номер телефона"}</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      +998 (91) 797-99-92
                    </span>
                  </div>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/roboshop_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Send size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-400 block">Telegram</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      @roboshop_admin
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@arduinoshop.uz"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-400 block">Email</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate block">
                      info@arduinoshop.uz
                    </span>
                  </div>
                </a>

                {/* Address with Copy */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-zinc-400 block mb-0.5">{isUz ? "Do'kon manzili" : "Адрес магазина"}</span>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-snug mb-2">
                        {storeAddress}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-amber-400 transition-colors"
                      >
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copied ? (isUz ? "Nusxalandi!" : "Скопировано!") : t("contact.copy_address")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Working hours pill */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" />
                <span>{isUz ? "Dush - Shanba: 09:00 - 20:00" : "Пн - Сб: 09:00 - 20:00"}</span>
              </div>
              <span className="text-zinc-500">{isUz ? "Yakshanba: Dam olish" : "Вс: Выходной"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

