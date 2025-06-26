import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function PopularCategories() {
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
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{
            color: "#facc15",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {t("popular.category")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card"
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                border: "1px solid rgba(250, 204, 21, 0.2)",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
