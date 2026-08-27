/**
 * Telegram WebApp Helpers & Utilities
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  phone_number?: string;
}

export interface TelegramWebAppType {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebAppType;
    };
  }
}

/**
 * Check if the application is running inside a Telegram Web App / Mini App
 */
export const isTelegramWebApp = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    !!window.Telegram?.WebApp?.initData ||
    !!window.Telegram?.WebApp?.initDataUnsafe?.user ||
    window.location.search.includes("tgWebAppData")
  );
};

/**
 * Get the Telegram WebApp instance if available
 */
export const getTelegramWebApp = (): TelegramWebAppType | null => {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
};

/**
 * Get the user from Telegram WebApp initData
 */
export const getTelegramUser = (): TelegramUser | null => {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
};

/**
 * Trigger Haptic Vibration Feedback
 */
export const triggerHaptic = (
  type: "light" | "medium" | "heavy" | "selection" | "success" | "error" | "warning" = "medium"
) => {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;

  try {
    if (type === "selection") {
      tg.HapticFeedback.selectionChanged();
    } else if (type === "success" || type === "error" || type === "warning") {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch {
    // Silently ignore if not supported
  }
};

/**
 * Initialize Telegram Mini App colors, full screen, and ready event
 */
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#070a12");
    tg.setBackgroundColor("#070a12");
  } catch (err) {
    console.error("Failed to initialize Telegram WebApp:", err);
  }
};
