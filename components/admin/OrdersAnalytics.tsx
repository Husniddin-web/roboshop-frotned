"use client";

import { useState } from "react";
import { useOrders, useOrderStata } from "../../lib/api";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

export default function OrdersAnalytics() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: stats = [], isLoading: statsLoading } = useOrderStata();
  const { data = [], isLoading: orderLoading } = useOrders();
  const orders = data.data || [];

  // Pagination calculations
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when changing items per page
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
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{
          color: "#ffffff",
          fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {t("orders.analytics")}
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="p-6 text-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
          whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <h3
            className="text-2xl font-bold"
            style={{
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {stats.total}
          </h3>
          <p
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("total.orders")}
          </p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
          whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.5)" }}
        >
          <h3
            className="text-2xl font-bold"
            style={{
              color: "#22c55e",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {stats.totalRevenue} UZS
          </h3>
          <p
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("total.revenue")}
          </p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "2px solid rgba(234, 179, 8, 0.3)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
          whileHover={{ scale: 1.02, borderColor: "rgba(234, 179, 8, 0.5)" }}
        >
          <h3
            className="text-2xl font-bold"
            style={{
              color: "#eab308",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {stats.pending}
          </h3>
          <p
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("pending.orders")}
          </p>
        </motion.div>
        <motion.div
          className="p-6 text-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
          whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
        >
          <h3
            className="text-2xl font-bold"
            style={{
              color: "#3b82f6",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {stats.confirmed}
          </h3>
          <p
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("completed.orders")}
          </p>
        </motion.div>
      </div>

      {/* Orders Table */}
      <motion.div
        className="rounded-lg shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Table Header with Controls */}
        <div
          className="p-6 border-b flex justify-between items-center"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            className="text-lg font-semibold"
            style={{
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {t("recent.orders")}
          </h3>

          {/* Items per page selector */}
          <div className="flex items-center gap-4">
            <span
              style={{
                color: "#a0a0a0",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                fontSize: "0.875rem",
              }}
            >
              Items per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="rounded-lg px-3 py-1 transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                fontSize: "0.875rem",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead
              style={{
                background: "linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)",
              }}
            >
              <tr>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("order.id")}
                </th>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("customer")}
                </th>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("phone")}
                </th>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("total")}
                </th>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("status")}
                </th>
                <th
                  className="p-4 text-left font-semibold"
                  style={{
                    color: "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: any, index: number) => (
                <motion.tr
                  key={order.id}
                  className="border-b transition-colors duration-200"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    #{order.id}
                  </td>
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {order.customerName}
                  </td>
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {order.phoneNumber}
                  </td>
                  <td
                    className="p-4"
                    style={{
                      color: "#ffffff",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {order.totalAmount} UZS
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "PENDING"
                          ? "bg-yellow-900 text-yellow-300 border border-yellow-600"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-900 text-blue-300 border border-blue-600"
                          : order.status === "DELIVERED"
                          ? "bg-green-900 text-green-300 border border-green-600"
                          : "bg-gray-800 text-gray-300 border border-gray-600"
                      }`}
                      style={{
                        fontFamily:
                          '"Courier New", "Monaco", "Menlo", monospace',
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td
                    className="p-4"
                    style={{
                      color: "#a0a0a0",
                      fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            className="p-6 border-t flex justify-between items-center"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Pagination Info */}
            <div
              style={{
                color: "#a0a0a0",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                fontSize: "0.875rem",
              }}
            >
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} orders
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              {/* First Page */}
              <motion.button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background:
                    currentPage === 1
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: currentPage === 1 ? "#666666" : "#ffffff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
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
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background:
                    currentPage === 1
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: currentPage === 1 ? "#666666" : "#ffffff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
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
                  className="px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background:
                      currentPage === pageNum
                        ? "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: currentPage === pageNum ? "#000000" : "#ffffff",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    fontWeight: currentPage === pageNum ? "700" : "500",
                    minWidth: "40px",
                  }}
                  whileHover={
                    currentPage !== pageNum
                      ? {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }
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
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background:
                    currentPage === totalPages
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: currentPage === totalPages ? "#666666" : "#ffffff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
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
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background:
                    currentPage === totalPages
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: currentPage === totalPages ? "#666666" : "#ffffff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
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
        {orders.length === 0 && !orderLoading && (
          <div
            className="p-12 text-center"
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            <p className="text-lg">No orders found</p>
            <p className="text-sm mt-2">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        )}

        {/* Loading State */}
        {orderLoading && (
          <div className="p-12 text-center">
            <motion.div
              className="loading mx-auto"
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                borderTop: "3px solid #ffffff",
                borderRadius: "50%",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <p
              className="mt-4"
              style={{
                color: "#a0a0a0",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
            >
              Loading orders...
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
