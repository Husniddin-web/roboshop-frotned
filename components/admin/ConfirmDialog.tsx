"use client";

import { motion, AnimatePresence } from "@/lib/no-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Ha, o'chirish",
  cancelText = "Bekor qilish",
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="rounded-xl shadow-2xl w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    danger ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  <FiAlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-gray-300 font-mono text-sm leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-lg border border-white/20 text-white font-mono text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-sm font-semibold transition-all disabled:opacity-50 ${
                  danger
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {loading ? "Yuklanmoqda..." : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
