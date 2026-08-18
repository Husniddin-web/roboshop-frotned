"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCategory } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Radio, Layers, Box, Sparkles } from "lucide-react";

const Motion: any = motion;


export default function PopularCategories() {
  const { t, i18n } = useTranslation();
  const { data: apiCategories = [], isLoading } = useCategory();

  const curatedCategories = [
    {
      name: "Arduino & Kontrollerlar",
      nameRu: "Arduino и Контроллеры",
      desc: "Uno, Mega, Nano, ESP32, STM32",
      image: "/plata.jpeg",
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      count: "30+",
    },
    {
      name: "Sensorlar & Datchiklar",
      nameRu: "Датчики и Сенсоры",
      desc: "Ultrasonik, Harorat, Harakat, Gaz",
      image: "/sensors.jpeg",
      icon: <Radio className="w-5 h-5 text-cyan-400" />,
      count: "50+",
    },
    {
      name: "Dvigatel & Modullar",
      nameRu: "Модули и Драйверы",
      desc: "Relay, L298N, Bluetooth, WiFi",
      image: "/module-1.jpg",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      count: "40+",
    },
    {
      name: "Robototexnika To'plamlari",
      nameRu: "Наборы для Робототехники",
      desc: "Boshlovchilar va Ta'lim to'plamlari",
      image: "/kit.jpg",
      icon: <Box className="w-5 h-5 text-purple-400" />,
      count: "20+",
    },
  ];

  const isUz = i18n.language === "uz";

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>{isUz ? "Katalog yo'nalishlari" : "Направления каталога"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t("popular.category")}
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>{t("popular.explore_all")}</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedCategories.map((cat, idx) => {
            const apiMatch = apiCategories[idx];
            const targetHref = apiMatch ? `/products?category=${apiMatch.id}` : "/products";
            const displayName = isUz ? cat.name : cat.nameRu;

            return (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={targetHref}
                  className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel glass-panel-hover border border-white/10 hover:border-amber-500/40 p-5 h-full block"
                >
                  {/* Category Image Preview Container */}
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-zinc-900/60">
                    <Image
                      src={cat.image}
                      alt={displayName}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Floating Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-medium text-amber-300">
                      {cat.count} {isUz ? "tur" : "видов"}
                    </div>

                    {/* Icon Badge */}
                    <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                      {cat.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                        {displayName}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-amber-400/90 group-hover:text-amber-300">
                      <span>{isUz ? "Mahsulotlarni ko'rish" : "Смотреть товары"}</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

