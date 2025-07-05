"use client";

import { useState, useMemo } from "react";
import { useOrders, useOrderStata } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fi";
import LoadingOrders from "../LoadingOrders";
import NoOrders from "../NoOrders";

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
  status: "PENDING" | "CONFIRMED" | "DELIVERED";
  notes: string;
  address: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrdersAnalytics({ search }: { search: string }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stats = [], isLoading: statsLoading } = useOrderStata();
  const { data: ordersResponse, isLoading: orderLoading } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    search,
  });

  const allOrders = ordersResponse?.data || [];

  // Frontend filtering
  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") {
      return allOrders;
    }
    return allOrders.filter((order: Order) => order.status === statusFilter);
  }, [allOrders, statusFilter]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
      <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
        {t("orders.analytics")}
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white/10 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <h3 className="text-2xl font-bold text-white font-mono">
            {stats.total}
          </h3>
          <p className="text-gray-400 font-mono">{t("total.orders")}</p>
        </motion.div>

        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-green-500 font-mono">
            {stats.totalRevenue} UZS
          </h3>
          <p className="text-gray-400 font-mono">{t("total.revenue")}</p>
        </motion.div>

        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(234, 179, 8, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-yellow-500 font-mono">
            {stats.pending}
          </h3>
          <p className="text-gray-400 font-mono">{t("pending.orders")}</p>
        </motion.div>

        <motion.div
          className="p-6 text-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 shadow-xl"
          whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
        >
          <h3 className="text-2xl font-bold text-blue-500 font-mono">
            {stats.confirmed}
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
        {/* Table Header with Controls */}
        <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">
            {t("recent.orders")}
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-white" size={16} />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="PROCESSING">Processing</option>
              </select>
            </div>

            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-mono text-sm">
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
              <tr>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("order.id")}
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("customer")}
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("phone")}
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("total")}
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="p-4 text-left font-semibold text-white font-mono uppercase tracking-wider">
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: Order, index: number) => (
                <motion.tr
                  key={order.id}
                  className="border-b border-white/5 transition-colors duration-200 cursor-pointer hover:bg-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => openOrderModal(order)}
                >
                  <td className="p-4 text-white font-mono">
                    #{order.id.slice(-8)}
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider ${
                        order.status === "PENDING"
                          ? "bg-yellow-900 text-yellow-300 border border-yellow-600"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-900 text-blue-300 border border-blue-600"
                          : order.status === "DELIVERED"
                          ? "bg-green-900 text-green-300 border border-green-600"
                          : "bg-gray-800 text-gray-300 border border-gray-600"
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
            {/* Pagination Info */}
            <div className="text-gray-400 font-mono text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} orders
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              {/* First Page */}
              <motion.button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/10 ${
                  currentPage === 1
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={
                  currentPage !== 1
                    ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                    : {}
                }
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                <FiChevronsLeft size={16} />
              </motion.button>

              {/* Previous Page */}
              <motion.button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/10 ${
                  currentPage === 1
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={
                  currentPage !== 1
                    ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                    : {}
                }
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                <FiChevronLeft size={16} />
              </motion.button>

              {/* Page Numbers */}
              {getPageNumbers().map((pageNum) => (
                <motion.button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 border border-white/10 font-mono min-w-[40px] ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-white to-gray-200 text-black font-bold"
                      : "bg-white/5 text-white hover:bg-white/10"
                  }`}
                  whileHover={
                    currentPage !== pageNum
                      ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                      : {}
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              ))}

              {/* Next Page */}
              <motion.button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/10 ${
                  currentPage === totalPages
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={
                  currentPage !== totalPages
                    ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                    : {}
                }
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                <FiChevronRight size={16} />
              </motion.button>

              {/* Last Page */}
              <motion.button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/10 ${
                  currentPage === totalPages
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={
                  currentPage !== totalPages
                    ? { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                    : {}
                }
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                <FiChevronsRight size={16} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && !orderLoading && <NoOrders />}
        {/* Loading State */}
        {orderLoading && <LoadingOrders />}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                  Order Details #{selectedOrder.id.slice(-8)}
                </h2>
                <motion.button
                  onClick={closeOrderModal}
                  className="p-2 rounded-lg transition-all duration-200 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                      <FiUser size={20} />
                      Customer Information
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
                      <div className="flex items-start gap-2">
                        <FiMapPin size={16} className="text-gray-400 mt-0.5" />
                        <span className="text-white font-mono">
                          {selectedOrder.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                      <FiDollarSign size={20} />
                      Order Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} className="text-gray-400" />
                        <span className="text-white font-mono">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">Status:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold font-mono uppercase ${
                            selectedOrder.status === "PENDING"
                              ? "bg-yellow-900 text-yellow-300 border border-yellow-600"
                              : selectedOrder.status === "CONFIRMED"
                              ? "bg-blue-900 text-blue-300 border border-blue-600"
                              : selectedOrder.status === "DELIVERED"
                              ? "bg-green-900 text-green-300 border border-green-600"
                              : "bg-gray-800 text-gray-300 border border-gray-600"
                          }`}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">Total:</span>
                        <span className="text-xl font-bold text-green-500 font-mono">
                          {Number.parseFloat(
                            selectedOrder.totalAmount
                          ).toLocaleString()}{" "}
                          UZS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white font-mono">
                    <FiPackage size={20} />
                    Order Items ({selectedOrder.orderItems.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 text-white font-mono">
                              {item.product.translations[0]?.name ||
                                "Product Name"}
                            </h4>
                            <p className="text-sm mb-2 text-gray-400 font-mono">
                              {item.product.translations[0]?.description ||
                                "No description"}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400 font-mono">
                                Quantity: {item.quantity}
                              </span>
                              <span className="text-gray-400 font-mono">
                                Unit Price:{" "}
                                {Number.parseFloat(
                                  item.product.price
                                ).toLocaleString()}{" "}
                                UZS
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-500 font-mono">
                              {(
                                Number.parseFloat(item.price) * item.quantity
                              ).toLocaleString()}{" "}
                              UZS
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-4 rounded-lg mt-6 bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2 text-white font-mono">
                      Notes
                    </h3>
                    <p className="text-gray-400 font-mono">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
