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

function UsefulContent() {
  const { t } = useTranslation();

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

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className="py-8"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(250, 204, 21, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(250, 204, 21, 0.02) 0%, transparent 50%)
          `,
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <div className="container relative z-10">
        <motion.h2
          className="text-2xl font-bold mb-6 text-center"
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
          {t("useful.content")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Arduino What Card */}
          <motion.div
            className="useful-card"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "1px solid rgba(250, 204, 21, 0.2)",
              borderRadius: "1rem",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              boxShadow: "0 12px 40px rgba(250, 204, 21, 0.2)",
              borderColor: "rgba(250, 204, 21, 0.4)",
            }}
          >
            {/* Image container with blur overlay */}
            <div
              style={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
              }}
            >
              <motion.div variants={imageVariants} whileHover="hover">
                <Image
                  src="/ai-curcuit.jpeg"
                  alt="AI Circuit Board"
                  fill
                  className="object-cover"
                  style={{
                    filter: "brightness(0.7) contrast(1.1)",
                  }}
                />
              </motion.div>
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.8) 100%)",
                }}
              />
              {/* Animated particles */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 40%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(250, 204, 21, 0.08) 0%, transparent 50%)
                  `,
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "#facc15",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("arduino.what")}
              </h3>
              <p
                style={{
                  color: "#d4d4aa",
                  lineHeight: "1.6",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontSize: "0.9rem",
                }}
              >
                {t("arduino.what.text")}
              </p>
            </div>
          </motion.div>

          {/* Arduino Why Card */}
          <motion.div
            className="useful-card"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "1px solid rgba(250, 204, 21, 0.2)",
              borderRadius: "1rem",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              boxShadow: "0 12px 40px rgba(250, 204, 21, 0.2)",
              borderColor: "rgba(250, 204, 21, 0.4)",
            }}
          >
            {/* Image container with blur overlay */}
            <div
              style={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
              }}
            >
              <motion.div variants={imageVariants} whileHover="hover">
                <Image
                  src="/retro-computer.jpg"
                  alt="Retro Computer"
                  fill
                  className="object-cover"
                  style={{
                    filter: "brightness(0.8) contrast(1.2)",
                  }}
                />
              </motion.div>
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.8) 100%)",
                }}
              />
              {/* Animated particles */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 60% 30%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 70%, rgba(250, 204, 21, 0.08) 0%, transparent 50%)
                  `,
                  animation: "pulse 4s ease-in-out infinite reverse",
                }}
              />
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "#facc15",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("arduino.why")}
              </h3>
              <p
                style={{
                  color: "#d4d4aa",
                  lineHeight: "1.6",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  fontSize: "0.9rem",
                }}
              >
                {t("arduino.why.text")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
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

// Add PopularCategories component
function PopularCategories() {
  const { t } = useTranslation();

  const categories = [
    {
      name: "Arduino платы",
      nameUz: "Arduino platalari",
      image: "/plata.jpeg",
      count: "25+ товаров",
      countUz: "25+ mahsulot",
    },
    {
      name: "Датчики",
      nameUz: "Sensorlar",
      image: "/sensors.jpeg",
      count: "50+ товаров",
      countUz: "50+ mahsulot",
    },
    {
      name: "Модули",
      nameUz: "Modullar",
      image: "/sensors.jpg",
      count: "30+ товаров",
      countUz: "30+ mahsulot",
    },
    {
      name: "Наборы",
      nameUz: "To'plamlar",
      image: "/module-1.jpg",
      count: "15+ товаров",
      countUz: "15+ mahsulot",
    },
  ];

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
          {t("popular.category")}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="category-card cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                border: "1px solid rgba(250, 204, 21, 0.2)",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 12px 40px rgba(250, 204, 21, 0.2)",
                borderColor: "rgba(250, 204, 21, 0.4)",
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#facc15" }}
                >
                  {category.name}
                </h3>
                <p style={{ color: "#d4d4aa", fontSize: "0.9rem" }}>
                  {category.count}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationAndContact() {
  const { t } = useTranslation();

  return (
    <section
      className="py-12"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:space-x-12">
          {/* Left side - Map */}
          <div
            className="md:w-3/5 w-full rounded-lg shadow-lg overflow-hidden mb-8 md:mb-0"
            style={{
              minHeight: "400px",
              border: "2px solid rgba(250, 204, 21, 0.2)",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.9356728397393!2d69.20105357567799!3d41.27323760306849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a39be5272f5%3A0x283b29f021a7a880!2sKorzinka%20%E2%80%94%20Bunyodkor!5e1!3m2!1sen!2s!4v1749979869227!5m2!1sen!2s"
              width="900"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div
            className="md:w-2/5 w-full rounded-lg shadow-lg p-8 flex flex-col justify-center"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "2px solid rgba(250, 204, 21, 0.2)",
            }}
          >
            <h3
              className="text-3xl font-semibold mb-6"
              style={{
                color: "#facc15",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
            >
              {t("contact.info")}
            </h3>
            <div
              className="space-y-4 text-lg leading-relaxed"
              style={{ color: "#d4d4aa" }}
            >
              <p>📞 +998 91 797 99 92</p>
              <p>📱 @roboshop_admin</p>
              <p>✉️ info@arduinoshop.uz</p>
              <p>🌐 roboticshop.uz</p>
            </div>
          </div>
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
