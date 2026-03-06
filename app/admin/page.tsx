"use client";
import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminPage() {
  return <AdminAuthGate initialTab="dashboard" />;
}
