"use client";

import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminProductsPage() {
  return <AdminAuthGate initialTab="products" />;
}
