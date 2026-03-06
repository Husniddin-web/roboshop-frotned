"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard, { type TabType } from "@/components/admin/AdminDashboard";
import { getAccessToken } from "@/lib/cookies";

export default function AdminAuthGate({ initialTab }: { initialTab?: TabType }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = getAccessToken();

  if (!isAuthenticated || !token) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab={initialTab} />;
}
