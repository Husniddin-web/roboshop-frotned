"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  removeFromCart,
  updateQuantity,
  setCartOpen,
} from "@/lib/features/cartSlice";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import OrderForm from "./OrderForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { items, total, isOpen } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(price);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center sm:items-center justify-center bg-black bg-opacity-50"
        onClick={() => dispatch(setCartOpen(false))}
      >
        <div
          className="w-full sm:max-w-md bg-[#1a1a1a] text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-lg shadow-lg relative max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold">{t("cart")}</h2>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="text-white hover:text-red-500 transition"
              aria-label="Close cart"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-neutral-400">
              {t("cart.empty")}
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-24 sm:pb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-neutral-700 pb-3"
                  >
                    {item.image && (
                      <img
                        src={`${BASE_URL}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-14 h-14 rounded object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-neutral-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="p-1.5 rounded border border-white text-white hover:bg-neutral-700 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>

                      <span className="w-6 text-center text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-1.5 rounded border border-white text-white hover:bg-neutral-700"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-500 hover:text-red-600 ml-2"
                      aria-label="Remove item"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Total + Order Button */}
              <div className="bg-[#1a1a1a] border-t border-neutral-700 pt-4 mt-4 sticky bottom-0 left-0 w-full">
                <div className="flex justify-between text-base sm:text-lg font-semibold mb-4 px-1">
                  <span>{t("total")}:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded transition-colors"
                >
                  {t("order.now")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} />}
    </>
  );
}
