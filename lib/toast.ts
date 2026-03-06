import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 1000,
      className: "toast-success-yellow",
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 2000,
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      duration: 3000,
    });
  },

  info: (message: string) => {
    toast.info(message, {
      duration: 3000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  update: (
    toastId: any,
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    const options = {
      id: toastId,
      duration: 1000,
      className: type === "success" ? "toast-success-yellow" : undefined,
    };

    if (type === "success") toast.success(message, options);
    else if (type === "error") toast.error(message, options);
    else if (type === "warning") toast.warning(message, options);
    else toast.info(message, options);
  },
};
