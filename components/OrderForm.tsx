"use client";

import type React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { clearCart, setCartOpen } from "@/lib/features/cartSlice";
import { useCreateOrder } from "@/lib/api";
import { FiX } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { isValidUzbekPhoneNumber } from "../lib/utils";
import { useTranslation } from "react-i18next";

interface OrderFormProps {
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phoneNumber: "",
    notes: "",
  });

  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const createOrderMutation = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderToastId = showToast.loading(t("submitting.order"));

    try {
      const orderData = {
        ...formData,
        totalAmount: total,
        orderItems: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createOrderMutation.mutateAsync(orderData);
      dispatch(clearCart());
      dispatch(setCartOpen(false));
      onClose();

      showToast.update(orderToastId, "success", t("order.success"));
    } catch (error) {
      console.error("Error submitting order:", error);
      showToast.update(orderToastId, "error", t("order.error"));
    }
  };

  const isFormValid =
    formData.customer_name.trim() &&
    formData.phoneNumber &&
    isValidUzbekPhoneNumber(formData.phoneNumber.slice(4));

  const isDisabled = createOrderMutation.isPending || !isFormValid;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{t("order.now")}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              {t("full.name")}
            </label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              {t("phone.number")}
            </label>
            <div className="flex items-center bg-neutral-800 border border-neutral-600 rounded-md px-3 py-2">
              <span className="text-sm text-neutral-400 mr-2">+998</span>
              <input
                type="tel"
                required
                inputMode="numeric"
                value={formData.phoneNumber.slice(4)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phoneNumber: `+998${digits}` });
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500"
                placeholder="901234567"
              />
            </div>
            {formData.phoneNumber.slice(4) &&
              !isValidUzbekPhoneNumber(formData.phoneNumber.slice(4)) && (
                <small className="text-red-500 text-xs mt-1 block">
                  Noto'g'ri raqam. Masalan: 901234567
                </small>
              )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              {t("notes")}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm text-white resize-vertical focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-md p-4">
            <h3 className="text-sm font-semibold text-neutral-300 mb-2">
              {t("order.summary")}:
            </h3>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-neutral-300 mb-1"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)} UZS</span>
              </div>
            ))}
            <div className="border-t border-neutral-700 mt-2 pt-2">
              <strong className="text-white text-sm">
                {t("total")}: {total.toFixed(2)} UZS
              </strong>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-3 px-6 rounded-md text-sm font-semibold transition-all duration-300 ${
              isDisabled
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {createOrderMutation.isPending ? "Loading..." : t("submit.order")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
