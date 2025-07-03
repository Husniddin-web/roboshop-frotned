"use client";

import type React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { clearCart, setCartOpen } from "@/lib/features/cartSlice";
import { useCreateOrder } from "@/lib/api";
import { FiX, FiMapPin } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { isValidUzbekPhoneNumber } from "../lib/utils";
import { useTranslation } from "react-i18next";

interface OrderFormProps {
  onClose: () => void;
}

const UZBEKISTAN_REGIONS = [
  { value: "tashkent_city", label: "Toshkent shahri" },
  { value: "tashkent_region", label: "Toshkent viloyati" },
  { value: "andijan", label: "Andijon viloyati" },
  { value: "bukhara", label: "Buxoro viloyati" },
  { value: "fergana", label: "Farg'ona viloyati" },
  { value: "jizzakh", label: "Jizzax viloyati" },
  { value: "kashkadarya", label: "Qashqadaryo viloyati" },
  { value: "khorezm", label: "Xorazm viloyati" },
  { value: "namangan", label: "Namangan viloyati" },
  { value: "navoi", label: "Navoiy viloyati" },
  { value: "samarkand", label: "Samarqand viloyati" },
  { value: "sirdarya", label: "Sirdaryo viloyati" },
  { value: "surkhandarya", label: "Surxondaryo viloyati" },
  { value: "karakalpakstan", label: "Qoraqalpog'iston Respublikasi" },
];

const TASHKENT_DISTRICTS = [
  { value: "bektemir", label: "Bektemir tumani" },
  { value: "chilanzar", label: "Chilonzor tumani" },
  { value: "mirzo_ulugbek", label: "Mirzo Ulug'bek tumani" },
  { value: "mirobod", label: "Mirobod tumani" },
  { value: "sergeli", label: "Sergeli tumani" },
  { value: "shayhantohur", label: "Shayhontohur tumani" },
  { value: "uchtepa", label: "Uchtepa tumani" },
  { value: "yunusobod", label: "Yunusobod tumani" },
  { value: "yakkasaray", label: "Yakkasaray tumani" },
  { value: "olmazar", label: "Olmazor tumani" },
  { value: "yashnobod", label: "Yashnobod tumani" },
];

const OrderForm: React.FC<OrderFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phoneNumber: "",
    notes: "",
    region: "",
    district: "",
    address: "",
    location: "",
    gps_coordinates: "",
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const createOrderMutation = useCreateOrder();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          gps_coordinates: `${latitude},${longitude}`,
        });
        setIsGettingLocation(false);
        showToast.success("Location captured successfully");
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
        showToast.error("Failed to get location. Please try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  };

  const getCombinedAddress = () => {
    const regionLabel =
      UZBEKISTAN_REGIONS.find((r) => r.value === formData.region)?.label || "";
    const districtLabel = formData.district
      ? TASHKENT_DISTRICTS.find((d) => d.value === formData.district)?.label ||
        ""
      : "";

    if (formData.region === "tashkent_city" && districtLabel) {
      return `${regionLabel}, ${districtLabel}`;
    }
    return regionLabel;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderToastId = showToast.loading(t("submitting.order"));

    try {
      const combinedAddress = getCombinedAddress();
      const fullAddress = formData.address.trim()
        ? `${combinedAddress}, ${formData.address}`
        : combinedAddress;

      const orderData = {
        customer_name: formData.customer_name,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
        address: fullAddress,
        location: formData.gps_coordinates,
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
    isValidUzbekPhoneNumber(formData.phoneNumber.slice(4)) &&
    formData.region &&
    (formData.region !== "tashkent_city" || formData.district);

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

          {/* Region */}
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Viloyat/Shahar
            </label>
            <select
              required
              value={formData.region}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  region: e.target.value,
                  district: "", // Reset district when region changes
                })
              }
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">Viloyatni tanlang</option>
              {UZBEKISTAN_REGIONS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* District (only for Tashkent City) */}
          {formData.region === "tashkent_city" && (
            <div>
              <label className="block text-sm text-neutral-300 mb-1">
                Tuman
              </label>
              <select
                required
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">Tumanni tanlang</option>
                {TASHKENT_DISTRICTS.map((district) => (
                  <option key={district.value} value={district.value}>
                    {district.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.region != "tashkent_city" ? (
            <div>
              <label className="block text-sm text-neutral-300 mb-1">
                To'liq manzil
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={2}
                placeholder="Ko'cha nomi, uy raqami, kvartira..."
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm text-white resize-vertical focus:outline-none focus:ring-2 focus:ring-white placeholder:text-neutral-500"
              />
            </div>
          ) : null}

          {/* GPS Location */}
          {formData.region === "tashkent_city" && (
            <div>
              <label className="block text-sm text-neutral-300 mb-1">
                GPS Joylashuv (ixtiyoriy)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formData.gps_coordinates}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gps_coordinates: e.target.value,
                    })
                  }
                  placeholder="41.2995,69.2401 yoki bosh qoldiring"
                  className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiMapPin size={16} />
                  <span>{isGettingLocation ? "..." : "GPS"}</span>
                </button>
              </div>
              <small className="text-neutral-500 text-xs mt-1 block">
                Aniq joylashuvni olish uchun "GPS" tugmasini bosing
              </small>
            </div>
          )}

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
