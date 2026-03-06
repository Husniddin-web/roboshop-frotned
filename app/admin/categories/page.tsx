"use client";

import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminCategoriesPage() {
  return <AdminAuthGate initialTab="categories" />;
}
