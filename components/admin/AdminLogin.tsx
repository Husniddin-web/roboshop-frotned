"use client";

import type React from "react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, setLoading } from "@/lib/features/authSlice";
import { useAdminLogin } from "@/lib/api";
import { toast } from "react-toastify";
import { saveAccessToken } from "../../lib/cookies";
import { useTranslation } from "react-i18next";
import { motion } from "@/lib/no-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const loginMutation = useAdminLogin();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const response = await loginMutation.mutateAsync(credentials);
      if (response?.status_code == 200) {
        saveAccessToken(response.data.accessToken);
        dispatch(loginSuccess(response.data.admin));
        toast.success(t("login.success"));
      }
    } catch (error) {
      toast.error(t("login.failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)",
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
          animation: "float 20s ease-in-out infinite",
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 rounded-full"
        style={{ background: "rgba(255, 255, 255, 0.1)" }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 right-32 w-6 h-6 rounded-full"
        style={{ background: "rgba(255, 255, 255, 0.08)" }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.08, 0.2, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Login Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
                color: "#000000",
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FiShield size={32} />
            </motion.div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {t("admin.login")}
            </h1>
            <p
              className="text-sm"
              style={{
                color: "#a0a0a0",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
            >
              Access the Arduino Shop Admin Panel
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                className="block text-sm font-semibold mb-2"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t("email")}
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{ color: "#a0a0a0" }}
                >
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full rounded-lg transition-all duration-200"
                  style={{
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    fontSize: "0.875rem",
                  }}
                  placeholder="admin@arduinoshop.uz"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(255, 255, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label
                className="block text-sm font-semibold mb-2"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t("password")}
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{ color: "#a0a0a0" }}
                >
                  <FiLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full rounded-lg transition-all duration-200"
                  style={{
                    padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    fontSize: "0.875rem",
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(255, 255, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded"
                  style={{
                    color: "#a0a0a0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.1, color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-3 rounded-lg transition-all duration-200"
              style={{
                padding: "1rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "700",
                background: loginMutation.isPending
                  ? "rgba(255, 255, 255, 0.05)"
                  : "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
                color: "#000000",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={
                !loginMutation.isPending
                  ? {
                      scale: 1.02,
                      background:
                        "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                      color: "#ffffff",
                    }
                  : {}
              }
              whileTap={!loginMutation.isPending ? { scale: 0.98 } : {}}
            >
              {loginMutation.isPending ? (
                <>
                  <motion.div
                    className="loading"
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      borderTop: "2px solid #ffffff",
                      borderRadius: "50%",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FiUser size={18} />
                  {t("login")}
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{
                  color: "#a0a0a0",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                }}
              >
                Secure Admin Access
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                }}
              >
                Arduino Shop Management System
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

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
      `}</style>
    </div>
  );
}
