"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { customerLoginSuccess } from "@/lib/features/userAuthSlice";
import { useSendTelegramOtp, useVerifyTelegramOtp } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/telegram";
import {
  FiX,
  FiSend,
  FiCheckCircle,
  FiPhone,
  FiUser,
  FiRefreshCw,
  FiExternalLink,
  FiShield,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

interface TelegramLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TelegramLoginModal({
  isOpen,
  onClose,
}: TelegramLoginModalProps) {
  const dispatch = useDispatch();
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [notRegistered, setNotRegistered] = useState(false);
  const defaultBotUsername =
    process.env.NEXT_PUBLIC_BOT_USERNAME || "robo_shop_uz_bot";
  const [botUrl, setBotUrl] = useState(`https://t.me/${defaultBotUsername}`);

  const { mutateAsync: sendOtp, isPending: isSendingOtp } =
    useSendTelegramOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyTelegramOtp();

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast.warning("Iltimos, telefon raqam yoki Telegram username kiriting");
      return;
    }

    setNotRegistered(false);
    const toastId = showToast.loading("Kod yuborilmoqda...");

    try {
      const res = await sendOtp({ identifier: identifier.trim() });

      if (res?.data?.not_registered) {
        setNotRegistered(true);
        if (res.data.bot_url) setBotUrl(res.data.bot_url);
        showToast.update(
          toastId,
          "warning",
          "Avval Telegram botimizga /start bosing"
        );
        return;
      }

      if (res?.status_code === 200) {
        triggerHaptic("success");
        setStep("otp");
        setCountdown(180); // 3 minutes
        showToast.update(
          toastId,
          "success",
          "Tasdiqlash kodi Telegram botingizga yuborildi!"
        );
      } else {
        showToast.update(
          toastId,
          "error",
          res?.message || "Kod yuborishda xatolik"
        );
      }
    } catch (err: any) {
      showToast.update(
        toastId,
        "error",
        err?.response?.data?.message || "Xatolik yuz berdi"
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      showToast.warning("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting");
      return;
    }

    const toastId = showToast.loading("Kod tekshirilmoqda...");

    try {
      const res = await verifyOtp({
        identifier: identifier.trim(),
        code: otpCode.trim(),
      });

      if (res?.data?.user) {
        triggerHaptic("success");
        dispatch(
          customerLoginSuccess({
            user: res.data.user,
            token: res.data.accessToken,
          })
        );
        showToast.update(
          toastId,
          "success",
          `Xush kelibsiz, ${res.data.user.firstName || "Foydalanuvchi"}!`
        );
        onClose();
        // Reset state
        setStep("identifier");
        setOtpCode("");
        setIdentifier("");
      }
    } catch (err: any) {
      triggerHaptic("error");
      showToast.update(
        toastId,
        "error",
        err?.response?.data?.message || "Kiritilgan kod noto'g'ri"
      );
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0d0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#229ED9] to-[#0088cc] flex items-center justify-center text-white shadow-lg shadow-[#0088cc]/20 mb-3">
            <FaTelegramPlane size={28} className="translate-x-[-1px]" />
          </div>
          <h3 className="text-xl font-bold font-mono tracking-wide text-white">
            {step === "identifier"
              ? "Telegram orqali kirish"
              : "Kodni tasdiqlash"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
            {step === "identifier"
              ? "Buyurtmalarni kuzatish va shaxsiy kabinetga kirish uchun Telegram bot orqali kiring"
              : `Telegram botingizga yuborilgan 6 xonali tasdiqlash kodini kiriting`}
          </p>
        </div>

        {/* Step 1: Identifier Input Form */}
        {step === "identifier" && (
          <div className="space-y-4">
            {/* Quick Registration Info Card */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 font-bold font-mono">
                  1. Yangi foydalanuvchimisiz?
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-300 font-mono">
                  Avto-ro'yxat
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Botimizga bir marta <b>/start</b> bosganingizdan so'ng, tizimga parolsiz kira olasiz:
              </p>
              <a
                href={botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-[#229ED9] hover:bg-[#0088cc] text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
              >
                <FaTelegramPlane size={13} />
                <span>@robo_shop_uz_bot ga o'tish (/start)</span>
                <FiExternalLink size={12} />
              </a>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
                  2. Telefon raqam yoki Telegram Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FiPhone size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67 yoki @username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-[#0088cc] focus:ring-2 focus:ring-[#0088cc]/20 transition-all"
                  />
                </div>
              </div>

              {/* Not registered alert */}
              {notRegistered && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs space-y-2 animate-in fade-in">
                  <p className="font-medium">
                    Ushbu profil bo'yicha bot topilmadi. Iltimos, avval botga /start bosing!
                  </p>
                  <a
                    href={botUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold font-mono hover:bg-amber-300 transition-colors text-[11px]"
                  >
                    <span>Botga o'tib /start bosing</span>
                    <FiExternalLink size={12} />
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp || !identifier.trim()}
                className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                  isSendingOtp || !identifier.trim()
                    ? "bg-white/5 text-zinc-500 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/10 active:scale-98"
                }`}
              >
                {isSendingOtp ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <FiSend size={15} />
                )}
                <span>{isSendingOtp ? "Yuborilmoqda..." : "Tasdiqlash kodini olish"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Code Form */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono mb-2 text-center">
                6 xonali tasdiqlash kodi
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                required
                placeholder="••••••"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full py-3.5 px-4 text-center tracking-[0.75em] text-2xl font-mono font-bold rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>

            {/* Timer & Resend */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span>Amal qilish vaqti:</span>
              {countdown > 0 ? (
                <span className="text-amber-400 font-bold">
                  {formatTimer(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-[#229ED9] hover:underline flex items-center gap-1"
                >
                  <FiRefreshCw size={12} />
                  <span>Qaytadan yuborish</span>
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("identifier")}
                className="w-1/3 py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-colors"
              >
                Orqaga
              </button>
              <button
                type="submit"
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className={`flex-1 py-3 px-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                  isVerifyingOtp || otpCode.length !== 6
                    ? "bg-white/5 text-zinc-600 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/10 active:scale-98"
                }`}
              >
                {isVerifyingOtp ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <FiCheckCircle size={16} />
                )}
                <span>{isVerifyingOtp ? "Tekshirilmoqda..." : "Tasdiqlash"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <FiShield size={12} className="text-emerald-500" />
          <span>Xavfsiz Telegram autentifikatsiyasi</span>
        </div>
      </div>
    </div>
  );
}
