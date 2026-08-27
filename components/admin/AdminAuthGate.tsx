"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/features/authSlice";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard, { type TabType } from "@/components/admin/AdminDashboard";
import { getAccessToken, removeAccessToken } from "@/lib/cookies";

export default function AdminAuthGate({ initialTab }: { initialTab?: TabType }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = getAccessToken();

    // If Redux says authenticated, but cookie token is missing or expired
    if (isAuthenticated && !token) {
      removeAccessToken();
      dispatch(logout());
    }
  }, [isAuthenticated, dispatch]);

  const token = getAccessToken();

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#070a12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab={initialTab} />;
}
