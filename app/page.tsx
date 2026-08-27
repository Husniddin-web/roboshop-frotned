"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  Award,
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  Radio,
  Box,
  CheckCircle2,
  Zap,
  ShoppingBag,
} from "lucide-react";
import UsefulContent from "../components/UseFullContent";
import PopularCategories from "../components/PopularCategories";
import LocationAndContact from "../components/LocationAdnContact";
import { FeaturedProducts } from "../components/FeaturedProducts";
import DiyProjectsHub from "../components/DiyProjectsHub";
import { features } from "../lib/consts/features";

const Motion: any = motion;



function HeroSection() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  const stats = [
    {
      value: "500+",
      labelUz: "Mahsulot turlari",
      labelRu: "Товаров в каталоге",
      icon: <Box className="w-4 h-4 text-amber-400" />,
    },
    {
      value: "2,000+",
      labelUz: "Yetkazilgan buyurtma",
      labelRu: "Успешных заказов",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      value: "100%",
      labelUz: "Kafolatlangan sifat",
      labelRu: "Гарантия качества",
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
    },
    {
      value: "24-48s",
      labelUz: "Tezkor yetkazib berish",
      labelRu: "Быстрая доставка",
      icon: <Truck className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center pt-8 md:pt-28 pb-16 overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Live Status Pill Badge */}
            <Motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm shadow-amber-500/10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>{t("hero.badge")}</span>
            </Motion.div>

            {/* Main Headline with Metallic Gold Gradient */}
            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]"
            >
              {isUz ? (
                <>
                  Elektronika va <br />
                  <span className="text-gradient-gold">Kelajak Texnologiyalari</span>
                </>
              ) : (
                <>
                  Электроника и <br />
                  <span className="text-gradient-gold">Технологии Будущего</span>
                </>
              )}
            </Motion.h1>

            {/* Subtitle */}
            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t("hero.description")}
            </Motion.p>

            {/* Dual CTA Buttons */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/products"
                className="btn btn-primary px-7 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                <span>{t("hero.button")}</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#ecosystem"
                className="btn btn-secondary px-6 py-3.5 text-sm sm:text-base font-semibold"
              >
                <Cpu size={18} className="text-amber-400" />
                <span>{isUz ? "Ekotizim bilan tanishish" : "Обзор экосистемы"}</span>
              </Link>
            </Motion.div>

            {/* Key Metrics Strip */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    {stat.icon}
                    <span className="truncate">{isUz ? stat.labelUz : stat.labelRu}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                </div>
              ))}
            </Motion.div>
          </div>

          {/* Right Column: High-Tech Glass Showcase Card (5 cols) */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative hidden md:block"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 p-6 shadow-2xl shadow-black/80">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono font-medium text-amber-400/90 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  SYSTEM READY • 16 MHz
                </div>
              </div>

              {/* Showcase Visual */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-zinc-900 via-[#101524] to-zinc-950 flex items-center justify-center">
                <Image
                  src="/plata.jpeg"
                  alt="Arduino Uno R3 High-Tech"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent" />

                {/* Floating Ping Chip */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Arduino Uno R3 SMD Edition</span>
                </div>
              </div>

              {/* Tech Specs Chips */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-zinc-400 block text-[10px]">Chipset</span>
                  <span className="font-mono font-bold text-amber-400">ATmega328P</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-zinc-400 block text-[10px]">Kuchlanish</span>
                  <span className="font-mono font-bold text-cyan-400">5V DC</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-zinc-400 block text-[10px]">Interfeys</span>
                  <span className="font-mono font-bold text-emerald-400">USB / UART</span>
                </div>
              </div>

              {/* Quick View Button */}
              <Link
                href="/products"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <ShoppingBag size={16} />
                <span>{isUz ? "Ommabop platalarni ko'rish" : "Смотреть топ платы"}</span>
              </Link>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}

// Modern Tech Ecosystem Section (replaces old dummy ElectronicsBackground)
function TechEcosystemShowcase() {
  const { i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  const pillars = [
    {
      icon: <Cpu className="w-7 h-7 text-amber-400" />,
      titleUz: "Mikrokontroller & Platalar",
      titleRu: "Микроконтроллеры и Платы",
      descUz: "Arduino Uno, Mega, Nano, ESP32 (Wi-Fi + BLE), Raspberry Pi va STM32 mikrosxemalari.",
      descRu: "Платы Arduino, ESP32 с Wi-Fi/BLE, мини-ПК Raspberry Pi и микроконтроллеры STM32.",
      tag: "Arduino • ESP32 • ARM",
      href: "/products",
    },
    {
      icon: <Radio className="w-7 h-7 text-cyan-400" />,
      titleUz: "Sensor & Datchiklar",
      titleRu: "Сенсоры и Датчики",
      descUz: "Masofa (Ultrasonik), harorat, namlik, gaz, harakat, giroskop va yorug'lik datchiklari.",
      descRu: "Ультразвуковые датчики, температуры/влажности, утечки газа, движения и гироскопы.",
      tag: "DHT • HC-SR04 • MPU6050",
      href: "/products",
    },
    {
      icon: <Layers className="w-7 h-7 text-emerald-400" />,
      titleUz: "Dvigatellar & Drayverlar",
      titleRu: "Двигатели и Драйверы",
      descUz: "Servo motorlar, qadamli motorlar, L298N drayverlar, relelar va quvvat modullari.",
      descRu: "Сервоприводы, шаговые моторы, драйверы L298N, реле и понижающие модули питания.",
      tag: "SG90 • L298N • Relays",
      href: "/products",
    },
    {
      icon: <Box className="w-7 h-7 text-purple-400" />,
      titleUz: "Robototexnika To'plamlari",
      titleRu: "Наборы Робототехники",
      descUz: "Boshlovchilar uchun Starter Kit, aqlli avtomobil (Smart Car) va STEM o'quv konstruktorlari.",
      descRu: "Стартовые наборы для новичков, конструкторы умных машинок и роботов-манипуляторов.",
      tag: "Starter Kit • Smart Car",
      href: "/products",
    },
  ];

  return (
    <section id="ecosystem" className="py-16 relative">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap size={13} />
            <span>{isUz ? "Ekotizim" : "Экосистема"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {isUz ? "Loyihangiz uchun to'liq yechim" : "Полные решения для ваших проектов"}
          </h2>
          <p className="text-sm text-zinc-400">
            {isUz
              ? "Boshlang'ich maktab o'quvchisidan tortib tajribali muhandisgacha kerak bo'ladigan barcha elektron qismlar"
              : "От простых школьных экспериментов до сложных коммерческих устройств автоматизации"}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <Motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={pillar.href}
                className="group relative flex flex-col justify-between p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 h-full block"
              >
                <div>
                  <div className="w-13 h-13 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-3 mb-5 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <div className="text-[11px] font-mono font-medium text-amber-400/90 mb-2">
                    {pillar.tag}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                    {isUz ? pillar.titleUz : pillar.titleRu}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {isUz ? pillar.descUz : pillar.descRu}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>{isUz ? "Bo'limga o'tish" : "Перейти в раздел"}</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// WhyChooseUs Bento Grid
function WhyChooseUs() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  return (
    <section className="py-16 relative">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award size={13} />
            <span>{isUz ? "Afzalliklarimiz" : "Преимущества"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t("why.us")}
          </h2>
          <p className="text-sm text-zinc-400">
            {isUz
              ? "Mijozlarimiz va muhandislar nima sababdan aynan RoboShop'ni tanlaydilar"
              : "Почему инженеры, мейкеры и студенты доверяют покупки нашему магазину"}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 sm:p-7 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
            >
              {/* Step Number & Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  {feature.icon}
                </div>
                <span className="text-2xl font-black text-white/20 font-mono">
                  {feature.num}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isUz ? feature.titleUz : feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {isUz ? feature.descriptionUz : feature.description}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Customer Reviews Testimonials Wall
function CustomerReviews() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  const reviews = [
    {
      id: 1,
      name: "Jasur Rahimov",
      initials: "JR",
      roleUz: "Robototexnika to'garagi o'qituvchisi",
      roleRu: "Преподаватель робототехники",
      rating: 5,
      commentUz:
        "O'quvchilarim uchun 15 ta Arduino Uno to'plamiga buyurtma bergandik. Ertasiga yetib keldi. Barcha platalar va sensorlar 100% original va soz holatda ishlayapti.",
      commentRu:
        "Заказывали 15 наборов Arduino Uno для школьного кружка. Доставили на следующий день. Все платы и датчики оригинальные, работают безупречно.",
      product: "Arduino Uno R3 Starter Kit",
      date: "12.02.2025",
    },
    {
      id: 2,
      name: "Mariya Ivanova",
      initials: "MI",
      roleUz: "IoT loyihalar muhandisi",
      roleRu: "Инженер IoT проектов",
      rating: 5,
      commentUz:
        "ESP32 va harorat datchiklarini tanlashda do'kon maslahatchilari juda yaxshi texnik tavsiyalar berishdi. Narxlari ham Toshkent bo'yicha eng maqbul.",
      commentRu:
        "Консультанты помогли правильно подобрать ESP32 и цифровые датчики для умного дома. Очень грамотная поддержка и разумные цены.",
      product: "ESP32 Wi-Fi + BLE Dev Module",
      date: "04.02.2025",
    },
    {
      id: 3,
      name: "Bobur Mirzayev",
      initials: "BM",
      roleUz: "TATU talabasi",
      roleRu: "Студент ТУИТ",
      rating: 5,
      commentUz:
        "Diplom ishim uchun L298N motor drayver va ultrasonik sensorlar kerak edi. Savatga qo'shib buyurtma berdim, tezkor yetkazib berishdi. Rahmat!",
      commentRu:
        "Для дипломного проекта срочно нужны были драйвер моторов L298N и ультразвуковые датчики. Быстро доставили, всё работает отлично!",
      product: "L298N + Ultrasonic Sensor",
      date: "28.01.2025",
    },
  ];

  return (
    <section className="py-16 relative">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star size={13} className="fill-amber-400" />
            <span>{isUz ? "Fikrlar & Reyting" : "Отзывы и Рейтинг"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t("reviews")}
          </h2>
          <p className="text-sm text-zinc-400">
            {isUz
              ? "Minglab mamnun mijozlarimiz va muhandislar tomonidan bildirilgan haqiqiy baholar"
              : "Реальные отзывы наших покупателей, студентов и преподавателей"}
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <Motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-7 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-bold text-sm flex items-center justify-center shadow-md">
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                      <p className="text-[11px] text-zinc-400">{isUz ? rev.roleUz : rev.roleRu}</p>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-5 italic">
                  "{isUz ? rev.commentUz : rev.commentRu}"
                </p>
              </div>

              {/* Purchase Badge & Date */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 size={12} />
                  <span>{t("reviews.verified")}</span>
                </span>
                <span className="font-mono text-zinc-500">{rev.date}</span>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="main-electronics-bg min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TechEcosystemShowcase />
        <FeaturedProducts />
        <PopularCategories />
        <DiyProjectsHub />
        <WhyChooseUs />
        <CustomerReviews />
        <UsefulContent />
        <LocationAndContact />
      </main>
      <Footer />
    </div>
  );
}


