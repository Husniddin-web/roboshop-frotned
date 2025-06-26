"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useAdminProducts } from "@/lib/api";
import { useEffect } from "react";
import AnimatedText from "../components/AnimatedText";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Shield, Truck, HeadphonesIcon, Award } from "lucide-react";
import UsefulContent from "../components/UseFullContent";
import PopularCategories from "../components/PopularCategories";
import LocationAndContact from "../components/LocationAdnContact";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p
          style={{ fontSize: "100px" }}
          className="text-5xl md:text-6xl lg:text-9xl font-bold leading-tight"
        >
          <AnimatedText
            text={t("hero.title")}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold"
            style={{ color: "#facc15" }}
          />
        </p>
        <p
          className="text-xl md:text-3xl lg:text-4xl mb-10"
          style={{ color: "#d4d4aa" }}
        >
          {t("hero.description")}
        </p>

        <Link href="/products" className="btn btn-secondary">
          {t("hero.button")}
        </Link>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["admin_products"] });
  }, [i18n.language, queryClient]);

  const { data: productsData, isLoading } = useAdminProducts();
  const products = productsData?.data || [];
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container text-center">
          <div
            className="loading mx-auto"
            style={{ width: "40px", height: "40px" }}
          />
          <p className="mt-4" style={{ color: "#d4d4aa" }}>
            {t("loading.products")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6 md:py-8">
      <div className="container px-2 sm:px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <h2
            className="text-base sm:[13px] md:[13px] font-bold"
            style={{
              color: "#facc15",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("featured.products")}
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 text-xs sm:text-sm md:text-base font-medium rounded-md sm:rounded-lg border border-yellow-400 bg-transparent text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200 min-h-[28px] sm:min-h-[32px] md:min-h-[36px] whitespace-nowrap"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span className="truncate">{t("view.all")}</span>
            <svg
              className="ml-1 sm:ml-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 12).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Add CustomerReviews component
function CustomerReviews() {
  const { t } = useTranslation();

  const reviews = [
    {
      id: 1,
      name: "Алексей Петров",
      nameUz: "Aleksey Petrov",
      rating: 5,
      comment:
        "Отличный магазин! Быстрая доставка и качественные товары. Arduino Uno работает идеально.",
      commentUz:
        "Ajoyib do'kon! Tez yetkazib berish va sifatli mahsulotlar. Arduino Uno mukammal ishlaydi.",
      date: "2024-01-15",
      product: "Arduino Uno R3",
    },
    {
      id: 2,
      name: "Мария Иванова",
      nameUz: "Mariya Ivanova",
      rating: 5,
      comment:
        "Профессиональная консультация помогла выбрать нужные датчики. Очень довольна покупкой!",
      commentUz:
        "Professional maslahat kerakli sensorlarni tanlashga yordam berdi. Xariddan juda mamnunman!",
      date: "2024-01-10",
      product: "Sensor Kit",
    },
    {
      id: 3,
      name: "Дмитрий Козлов",
      nameUz: "Dmitriy Kozlov",
      rating: 4,
      comment:
        "Хороший ассортимент и разумные цены. Рекомендую для начинающих в Arduino.",
      commentUz:
        "Yaxshi assortiment va oqilona narxlar. Arduino boshlovchilar uchun tavsiya qilaman.",
      date: "2024-01-08",
      product: "Arduino Starter Kit",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="py-12"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
      }}
    >
      <div className="container">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          style={{
            color: "#facc15",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t("reviews")}
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={cardVariants}
              className="review-card"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                border: "1px solid rgba(250, 204, 21, 0.2)",
                borderRadius: "1rem",
                padding: "1.5rem",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(250, 204, 21, 0.2)",
                borderColor: "rgba(250, 204, 21, 0.4)",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span style={{ color: "#d4d4aa", fontSize: "0.9rem" }}>
                  {review.date}
                </span>
              </div>

              <h4
                style={{
                  color: "#facc15",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                {review.name}
              </h4>

              <p
                style={{
                  color: "#d4d4aa",
                  lineHeight: "1.6",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                {review.comment}
              </p>

              <div
                style={{
                  color: "#facc15",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {review.product}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Add WhyChooseUs component
function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Shield size={32} />,
      title: "Гарантия качества",
      titleUz: "Sifat kafolati",
      description: "Все товары проходят проверку качества",
      descriptionUz: "Barcha mahsulotlar sifat tekshiruvidan o'tadi",
    },
    {
      icon: <Truck size={32} />,
      title: "Быстрая доставка",
      titleUz: "Tez yetkazib berish",
      description: "Доставка по всему Узбекистану за 1-3 дня",
      descriptionUz: "O'zbekiston bo'ylab 1-3 kun ichida yetkazib berish",
    },
    {
      icon: <HeadphonesIcon size={32} />,
      title: "Техподдержка 24/7",
      titleUz: "24/7 texnik yordam",
      description: "Профессиональная консультация в любое время",
      descriptionUz: "Istalgan vaqtda professional maslahat",
    },
    {
      icon: <Award size={32} />,
      title: "Лучшие цены",
      titleUz: "Eng yaxshi narxlar",
      description: "Конкурентные цены на все товары",
      descriptionUz: "Barcha mahsulotlarga raqobatbardosh narxlar",
    },
  ];

  return (
    <section
      className="py-12"
      style={{
        background: "linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%)",
      }}
    >
      <div className="container">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          style={{
            color: "#facc15",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t("why.us")}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                border: "1px solid rgba(250, 204, 21, 0.2)",
                borderRadius: "1rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(250, 204, 21, 0.2)",
                borderColor: "rgba(250, 204, 21, 0.4)",
              }}
            >
              <div
                className="mb-4 flex justify-center"
                style={{ color: "#facc15" }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "#facc15" }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "#d4d4aa",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ElectronicsBackground() {
  const { t } = useTranslation();

  return (
    <section className="electronics-background">
      <div className="circuit-pattern"></div>
      <div className="container">
        <div className="electronics-content">
          <h2 className="electronics-title">Innovation Meets Technology</h2>
          <p className="electronics-subtitle">
            Discover the future of electronics and robotics
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="main-electronics-bg">
      <Header />
      <main>
        <HeroSection />
        <ElectronicsBackground />
        <FeaturedProducts />
        <PopularCategories />
        <WhyChooseUs />
        <CustomerReviews />
        <UsefulContent />
        
        <LocationAndContact />
      </main>
      <Footer />
      <Cart />
    </div>
  );
}
