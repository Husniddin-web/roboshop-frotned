"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "#d4d4aa",
        padding: "2rem 1rem",
        textAlign: "center",
        borderTop: "2px solid rgba(250, 204, 21, 0.1)",
        fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#facc15",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.75rem",
          }}
        >
          Arduino Shop
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#a3a3a3",
            marginBottom: "1.5rem",
          }}
        >
          {t("footer.description")}
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#777",
          }}
        >
          {t("footer.text")}
        </p>
      </div>
    </footer>
  );
}
