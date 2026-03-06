"use client";

import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminOrdersPage() {
  return <AdminAuthGate initialTab="orders" />;
}
