"use client";

import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminDashboardPage() {
  return <AdminAuthGate initialTab="dashboard" />;
}
