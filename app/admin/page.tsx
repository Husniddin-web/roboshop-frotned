"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAccessToken } from "../../lib/cookies";

export default function AdminPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = getAccessToken();
  if (!isAuthenticated || !token) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
