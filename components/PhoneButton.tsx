"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { FiPhone, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { isTelegramWebApp } from "@/lib/telegram";

const PhoneButton: React.FC = () => {
  const [showContact, setShowContact] = useState(false);
  const [isTMA, setIsTMA] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsTMA(isTelegramWebApp());
  }, []);

  // Hide completely inside Telegram Mini App
  if (isTMA) {
    return null;
  }

  const contactInfo = {
    phone: "+998 91 797 99 92",
    telegram: "@roboshop_admin",
    workingHours: {
      uz: "Dush-Yak: 9:00-18:00",
      ru: "Пн-Пт: 9:00-18:00",
    },
  };

  return (
    <>
      {/* Hidden on mobile (md:flex only) to not collide with bottom nav */}
      <button
        onClick={() => setShowContact(true)}
        className="phone-button hidden md:flex"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#facc15",
          color: "#1a1a1a",
          border: "2px solid #facc15",
          boxShadow: "0 4px 12px rgba(250, 204, 21, 0.4)",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "all 0.3s ease",
          fontSize: "14px",
          fontWeight: "600",
        }}
        aria-label="Contact Support"
      >
        <FiPhone size={22} />
      </button>

      {/* Contact Modal */}
      {showContact && (
        <div
          className="modal-overlay"
          onClick={() => setShowContact(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "380px",
              width: "90%",
              textAlign: "center",
              animation: "slideInUp 0.3s ease",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              border: "2px solid rgba(250, 204, 21, 0.3)",
              color: "#facc15",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  color: "#facc15",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "16px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                {t("contact.info")}
              </h3>
              <button
                onClick={() => setShowContact(false)}
                className="close-button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#facc15",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  transition: "all 0.2s ease",
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#facc15",
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  boxShadow: "0 4px 15px rgba(250, 204, 21, 0.3)",
                }}
              >
                <FiPhone size={28} />
              </div>
              <h4
                style={{
                  color: "#facc15",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "15px",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Arduino Shop
              </h4>
              <p style={{ color: "#d4d4aa", fontSize: "13px", margin: 0 }}>
                {t("contact.us.anytime")}
              </p>
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
              <div
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  background: "rgba(250, 204, 21, 0.08)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(250, 204, 21, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <FiPhone size={14} color="#facc15" />
                  <strong style={{ color: "#facc15", fontSize: "13px" }}>
                    {t("phone")}:
                  </strong>
                </div>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="contact-link"
                  style={{
                    color: "#facc15",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "color 0.2s ease",
                  }}
                >
                  {contactInfo.phone}
                </a>
              </div>

              <div
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  background: "rgba(250, 204, 21, 0.08)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(250, 204, 21, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>📱</span>
                  <strong style={{ color: "#facc15", fontSize: "13px" }}>
                    {t("telegram")}:
                  </strong>
                </div>
                <a
                  href={`https://t.me/${contactInfo.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  style={{
                    color: "#facc15",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "color 0.2s ease",
                  }}
                >
                  {contactInfo.telegram}
                </a>
              </div>

              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(250, 204, 21, 0.08)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(250, 204, 21, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>🕒</span>
                  <strong style={{ color: "#facc15", fontSize: "13px" }}>
                    {t("working.hours")}:
                  </strong>
                </div>
                <p
                  style={{
                    color: "#d4d4aa",
                    margin: "0 0 0.25rem 0",
                    fontSize: "12px",
                  }}
                >
                  {t("monday.friday")}
                </p>
                <p
                  style={{
                    color: "#d4d4aa",
                    margin: "0 0 0.25rem 0",
                    fontSize: "12px",
                  }}
                >
                  {t("saturday")}
                </p>
                <p style={{ color: "#d4d4aa", margin: 0, fontSize: "12px" }}>
                  {t("sunday.closed")}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                className="action-button call-button"
                style={{
                  flex: 1,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "#facc15",
                  color: "#1a1a1a",
                  border: "2px solid #facc15",
                  transition: "all 0.2s ease",
                }}
              >
                <FiPhone size={14} />
                {t("call.now")}
              </a>
              <a
                href={`https://t.me/${contactInfo.telegram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button telegram-button"
                style={{
                  flex: 1,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "transparent",
                  color: "#facc15",
                  border: "2px solid #facc15",
                  transition: "all 0.2s ease",
                }}
              >
                📱 Telegram
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .phone-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.6);
          background: #facc15 !important;
        }

        .close-button:hover {
          background: rgba(250, 204, 21, 0.1) !important;
          transform: scale(1.1);
        }

        .contact-link:hover {
          color: #facc15 !important;
          text-decoration: underline;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
        }

        .call-button:hover {
          background: #facc15 !important;
          color: #1a1a1a !important;
        }

        .telegram-button:hover {
          background: #facc15 !important;
          color: #1a1a1a !important;
        }

        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default PhoneButton;
