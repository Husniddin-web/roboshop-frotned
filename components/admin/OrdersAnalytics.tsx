"use client";

import type React from "react";
import { useState } from "react";
import {
  useOrders,
  useOrderStata,
  useDeleteOrder,
  useUpdateOrderStatus,
  useDeleteAllOrders,
} from "../../lib/api";
import { motion, AnimatePresence } from "@/lib/no-motion";
import { useTranslation } from "react-i18next";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiFilter,
  FiPackage,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import LoadingOrders from "../LoadingOrders";
import NoOrders from "../NoOrders";
import ConfirmDialog from "./ConfirmDialog";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    price: string;
    translations: Array<{
      name: string;
      description: string;
    }>;
  };
}

interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  totalAmount: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED" | "PROCESSING";
  notes: string;
  address: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrdersAnalytics({ search }: { search: string }) {
  const { t } = useTranslation();

  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // --- DATA FETCHING ---
  const { data: stats = [], isLoading: statsLoading } = useOrderStata();
  const deleteOrderMutation = useDeleteOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteAllMutation = useDeleteAllOrders();

  const { data: ordersResponse, isLoading: orderLoading } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    search,
    status: statusFilter,
    date: dateFilter,
  });

  // --- DERIVED DATA ---
  const currentOrders = ordersResponse?.data || [];
  const totalItems = ordersResponse?.meta?.total || 0;
  const totalPages = ordersResponse?.meta?.lastPage || 1;

  // --- EVENT HANDLERS ---
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  const handleFilterChange = (
    updater: React.Dispatch<React.SetStateAction<any>>,
    value: any
  ) => {
    updater(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatusFilter("ALL");
    setDateFilter("");
    setCurrentPage(1);
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
    setShowDeleteConfirm(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || editingStatus === selectedOrder.status) return;
    await updateStatusMutation.mutateAsync({ id: selectedOrder.id, status: editingStatus });
    setSelectedOrder({ ...selectedOrder, status: editingStatus as Order["status"] });
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    await deleteOrderMutation.mutateAsync(selectedOrder.id);
    setShowDeleteConfirm(false);
    closeOrderModal();
  };

  const handleDeleteAll = async () => {
    await deleteAllMutation.mutateAsync();
    setShowDeleteAllConfirm(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 1) return [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
          {t("orders.analytics")}
        </h2>
        <motion.button
          onClick={() => setShowDeleteAllConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-sm font-semibold hover:bg-red-600/40 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <FiTrash2 size={16} />
          Hammasini o'chirish
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white/10 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <h3 className="text-2xl font-bold text-white font-mono">
            {stats.total || 0}
          </h3>
          <p className="text-gray-400 font-mono">{t("total.orders")}</p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-green-500 font-mono">
            {stats.totalRevenue || 0} UZS
          </h3>
          <p className="text-gray-400 font-mono">{t("total.revenue")}</p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(234, 179, 8, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-yellow-500 font-mono">
            {stats.pending || 0}
          </h3>
          <p className="text-gray-400 font-mono">{t("pending.orders")}</p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-blue-500 font-mono">
            {stats.confirmed || 0}
          </h3>
          <p className="text-gray-400 font-mono">{t("completed.orders")}</p>
        </motion.div>
      </div>

      {/* Orders Table */}
      <motion.div
        className="rounded-lg shadow-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-2 border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Table Header with ALL Controls */}
        <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">
            {t("recent.orders")}
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className="text-white" size={16} />
              <select
                value={statusFilter}
                onChange={(e) =>
                  handleFilterChange(setStatusFilter, e.target.value)
                }
                className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="PROCESSING">Processing</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) =>
                  handleFilterChange(setDateFilter, e.target.value)
                }
                className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm [color-scheme:dark]"
              />
            </div>
            {(statusFilter !== "ALL" || dateFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
              >
                <FiRefreshCw size={14} /> Clear Filters
              </button>
            )}
            <select
              value={itemsPerPage}
              onChange={(e) =>
                handleFilterChange(setItemsPerPage, Number(e.target.value))
              }
              className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
              <tr>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  ID
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: Order, index: number) => (
                <motion.tr
                  key={order.id}
                  className="border-b border-white/5 transition-colors duration-200 cursor-pointer hover:bg-white/5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => openOrderModal(order)}
                >
                  <td className="p-4 text-white font-mono">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="p-4 text-white font-mono">
                    {order.customerName}
                  </td>
                  <td className="p-4 text-white font-mono">
                    {order.phoneNumber}
                  </td>
                  <td className="p-4 text-white font-mono">
                    {Number.parseFloat(order.totalAmount).toLocaleString()} UZS
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider ${
                        order.status === "PENDING"
                          ? "bg-yellow-900/70 text-yellow-300"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-900/70 text-blue-300"
                          : order.status === "DELIVERED"
                          ? "bg-green-900/70 text-green-300"
                          : "bg-gray-800/70 text-gray-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 font-mono text-sm">
              Showing{" "}
              {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              orders
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 text-white border border-white/10 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronsLeft size={16} />
              </motion.button>
              <motion.button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 text-white border border-white/10 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronLeft size={16} />
              </motion.button>
              {getPageNumbers().map((pageNum) => (
                <motion.button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg border border-white/10 font-mono min-w-[40px] ${
                    currentPage === pageNum
                      ? "bg-white text-black font-bold"
                      : "bg-white/5 text-white"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              ))}
              <motion.button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 text-white border border-white/10 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronRight size={16} />
              </motion.button>
              <motion.button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 text-white border border-white/10 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <FiChevronsRight size={16} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Loading and Empty States */}
        {orderLoading && <LoadingOrders />}
        {!orderLoading && currentOrders.length === 0 && <NoOrders />}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderModal}
          >
            <motion.div
              className="rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-gray-900/80 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                  Order Details #{selectedOrder.id.slice(-6)}
                </h2>
                <motion.button
                  onClick={closeOrderModal}
                  className="p-2 rounded-full bg-white/10 text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={20} />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                      <FiUser size={20} />
                      Customer Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} className="text-gray-400" />
                        <span className="text-white font-mono">
                          {selectedOrder.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone size={16} className="text-gray-400" />
                        <span className="text-white font-mono">
                          {selectedOrder.phoneNumber}
                        </span>
                      </div>
                      {selectedOrder.address && (
                        <div className="flex items-start gap-2">
                          <FiMapPin size={16} className="text-gray-400 mt-0.5" />
                          <span className="text-white font-mono">
                            {selectedOrder.address}
                          </span>
                        </div>
                      )}
                      {selectedOrder.notes && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 font-mono text-sm">📝</span>
                          <span className="text-gray-300 font-mono text-sm">{selectedOrder.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                      <FiDollarSign size={20} />
                      Order Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} className="text-gray-400" />
                        <span className="text-white font-mono">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">Total:</span>
                        <span className="text-xl font-bold text-green-500 font-mono">
                          {Number.parseFloat(selectedOrder.totalAmount).toLocaleString()} UZS
                        </span>
                      </div>
                      {/* Status Changer */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-gray-400 font-mono text-sm">Status o'zgartirish:</span>
                        <div className="flex gap-2">
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm"
                          >
                            <option value="PENDING">⏳ PENDING</option>
                            <option value="CONFIRMED">✅ CONFIRMED</option>
                            <option value="PROCESSING">⚙️ PROCESSING</option>
                            <option value="SHIPPED">🚚 SHIPPED</option>
                            <option value="DELIVERED">📦 DELIVERED</option>
                            <option value="CANCELLED">❌ CANCELLED</option>
                          </select>
                          <motion.button
                            onClick={handleUpdateStatus}
                            disabled={updateStatusMutation.isPending || editingStatus === selectedOrder.status}
                            className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-mono text-sm font-semibold transition-colors disabled:opacity-40 flex items-center gap-1"
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiSave size={14} />
                            {updateStatusMutation.isPending ? "..." : "Saqlash"}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                    <FiPackage size={20} />
                    Order Items ({selectedOrder.orderItems.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="p-4 rounded-lg bg-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-white font-mono">
                              {item.product.translations[0]?.name || "Product"}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                              <span>Qty: {item.quantity}</span>
                              <span>
                                @ {Number.parseFloat(item.product.price).toLocaleString()} UZS
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-500 font-mono">
                              {(Number.parseFloat(item.price) * item.quantity).toLocaleString()} UZS
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Delete Order Button */}
                <div className="flex justify-end">
                  <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-sm font-semibold hover:bg-red-600/40 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrash2 size={16} />
                    Buyurtmani o'chirish
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm: Delete single order */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Buyurtmani o'chirish"
        message={`#${selectedOrder?.id.slice(-6)} buyurtma o'chirilsin. Bu amal qaytarilmaydi!`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
        onConfirm={handleDeleteOrder}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={deleteOrderMutation.isPending}
        danger
      />

      {/* Confirm: Delete all orders */}
      <ConfirmDialog
        isOpen={showDeleteAllConfirm}
        title="BARCHA Buyurtmalarni O'chirish"
        message="Tizimda mavjud bo'lgan BARCHA buyurtmalar o'chiriladi. Bu amal hech qanday tarzda qaytarib bo'lmaydi!"
        confirmText="Ha, hammasini o'chirish"
        cancelText="Bekor qilish"
        onConfirm={handleDeleteAll}
        onCancel={() => setShowDeleteAllConfirm(false)}
        loading={deleteAllMutation.isPending}
        danger
      />
    </motion.div>
  );
}
