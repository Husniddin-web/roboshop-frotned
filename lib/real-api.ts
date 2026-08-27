import axios from "axios";
import { getAccessToken, removeAccessToken } from "./cookies";
import { store } from "./store";
import { logout } from "./features/authSlice";
import { toast } from "sonner";

const URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: URL,
});

// Request Interceptor: Attach language and auth token automatically
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("i18nextLng") || "uz";
      config.headers["lang"] = lang;
    }

    const token = getAccessToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      removeAccessToken();
      store.dispatch(logout());

      if (typeof window !== "undefined") {
        toast.error("Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.", {
          id: "session-expired",
        });

        // If user is inside any admin route, send them to the admin login gate
        if (
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin"
        ) {
          window.location.replace("/admin");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
