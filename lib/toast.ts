import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
      className: "toast-success-yellow",
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  info: (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      // spinner color set globally in CSS
    });
  },

  update: (
    toastId: any,
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      className: type === "success" ? "toast-success-yellow" : "",
    });
  },
};
