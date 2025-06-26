import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LocationAndContact() {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

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

  return (
    <section
      className="py-12"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:space-x-12">
          {/* Left: Map */}
          <div
            className="md:w-3/5 w-full rounded-lg overflow-hidden mb-8 md:mb-0"
            style={{
              minHeight: "400px",
              border: "2px solid rgba(250, 204, 21, 0.2)",
              backgroundColor: "#1f1f1f",
            }}
            ref={iframeRef}
          >
            {showMap ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.9356728397393!2d69.20105357567799!3d41.27323760306849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a39be5272f5%3A0x283b29f021a7a880!2sKorzinka%20%E2%80%94%20Bunyodkor!5e1!3m2!1sen!2s!4v1749979869227!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#2d2d2d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  fontSize: "1rem",
                }}
              >
                {t("loading.map") || "Loading map..."}
              </div>
            )}
          </div>

          {/* Right: Contact Info */}
          <div
            className="md:w-2/5 w-full rounded-lg p-8 flex flex-col justify-center"
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
