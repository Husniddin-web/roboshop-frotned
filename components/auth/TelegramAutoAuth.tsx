"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  customerLoginSuccess,
  setUserLoading,
} from "@/lib/features/userAuthSlice";
import {
  isTelegramWebApp,
  getTelegramWebApp,
  getTelegramUser,
  initTelegramApp,
} from "@/lib/telegram";
import { useTelegramWebAppLogin } from "@/lib/api";

export default function TelegramAutoAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userAuth
  );
  const { mutateAsync: webAppLogin } = useTelegramWebAppLogin();
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasAttempted.current) return;

    // Check if running inside Telegram WebApp
    const tg = getTelegramWebApp();
    if (tg && isTelegramWebApp()) {
      hasAttempted.current = true;
      initTelegramApp();

      const tgUser = getTelegramUser();
      const initData = tg.initData || "";

      // If user is already loaded and matches current telegram user, skip network call
      if (
        isAuthenticated &&
        user &&
        tgUser &&
        String(user.telegramId) === String(tgUser.id)
      ) {
        return;
      }

      if (tgUser || initData) {
        dispatch(setUserLoading(true));
        webAppLogin({
          initData,
          user: tgUser || undefined,
        })
          .then((res) => {
            if (res?.data?.user) {
              dispatch(
                customerLoginSuccess({
                  user: res.data.user,
                  token: res.data.accessToken,
                })
              );
            }
          })
          .catch((err) => {
            console.warn("Telegram auto-auth silent error:", err);
          })
          .finally(() => {
            dispatch(setUserLoading(false));
          });
      }
    }
  }, [dispatch, isAuthenticated, user, webAppLogin]);

  return null;
}
