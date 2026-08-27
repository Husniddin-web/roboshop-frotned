import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockProducts,
  mockCategories,
  mockLanguages,
  mockAdmin,
} from "./mockData";
import {
  adminLogin,
  createCategory,
  createOrder,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAllCategory,
  getAllCategoryForAdmin,
  getAllOrders,
  getAllProducts,
  getAdminDashboardSummary,
  getCategoryPreviews,
  getLang,
  getOneProductById,
  getOneProductByIdForAdmin,
  getOrderStats,
  OrderQueryOptions,
  removeImage,
  updateCategory,
  updateProduct,
  uploadImage,
  deleteOrder,
  updateOrderStatus,
  deleteAllOrders,
  telegramWebAppLoginApi,
  sendTelegramOtpApi,
  verifyTelegramOtpApi,
  getTelegramProfileApi,
  getMyOrdersApi,
} from "./api-real";
import { ProductQueryOptions } from "../app/products/interface";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Generic API function
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // For demo purposes, return mock data instead of making real API calls
  if (endpoint.includes("/products/featured")) {
    return { products: mockProducts.slice(0, 6) } as T;
  }

  if (endpoint.includes("/products/") && !endpoint.includes("admin")) {
    const id = endpoint.split("/").pop();
    const product = mockProducts.find((p) => p.id === id);
    return product as T;
  }

  if (endpoint.includes("/products")) {
    const params = new URLSearchParams(endpoint.split("?")[1] || "");
    const page = Number.parseInt(params.get("page") || "1");
    const categoryId = params.get("categoryId");
    const search = params.get("search");

    let filteredProducts = mockProducts;
    if (categoryId) {
      filteredProducts = mockProducts.filter(
        (p) => p.categoryId === categoryId
      );
    }
    if (search) {
      filteredProducts = mockProducts.filter((p) =>
        p.translations.some(
          (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    const pageSize = 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      products: filteredProducts.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredProducts.length / pageSize),
      currentPage: page,
      total: filteredProducts.length,
    } as T;
  }

  if (endpoint.includes("/categories")) {
    return mockCategories as T;
  }

  if (endpoint.includes("/languages")) {
    return mockLanguages as T;
  }

  if (endpoint.includes("/admin/login")) {
    const body = JSON.parse(options?.body as string);
    if (
      body.email === mockAdmin.email &&
      body.password === mockAdmin.password
    ) {
      return mockAdmin as T;
    }
    throw new Error("Invalid credentials");
  }

  if (
    endpoint.includes("/admin/products") &&
    !endpoint.includes("/admin/products/")
  ) {
    return { products: mockProducts } as T;
  }

  if (endpoint.includes("/orders") && options?.method === "POST") {
    // Simulate order creation
    return { success: true, orderId: Date.now().toString() } as T;
  }

  // Fallback to actual API call
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getOneProductById(id),
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => apiRequest("/products/featured"),
  });
};

// Categories API
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiRequest("/categories"),
  });
};

// Languages API
export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => apiRequest("/languages"),
  });
};

// Orders API
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: any) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
// Admin Login
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      adminLogin(credentials),
  });
};

export const useAdminProducts = ({
  search,
  category,
  page,
  limit,
}: ProductQueryOptions) => {
  return useQuery({
    queryKey: ["admin_products", { search, category, page, limit }],
    queryFn: () => getAllProducts({ search, category, page, limit }),
    enabled: true,
  });
};

export const useAdminDashboardSummary = () => {
  return useQuery({
    queryKey: ["admin_dashboard_summary"],
    queryFn: getAdminDashboardSummary,
  });
};

export const useCategoryPreviews = () => {
  return useQuery({
    queryKey: ["category_previews"],
    queryFn: getCategoryPreviews,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: any) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateProduct(data, id),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["one_product", id] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(data, id),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: any }) => createCategory(data),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategory(id),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });
};

// Admin Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["one_product", id] });
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadImage(data),
    onSuccess: (data) => {
      console.log("Image uploaded successfully:", data);
    },
    onError: (error: any) => {
      console.error("Upload failed:", error);
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: string) => removeImage(path),
    onSuccess: (_data, path) => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["one_product", path] });
    },
  });
};

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });
};

export const useCategoryForAdmin = (search: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["categories", search, page, limit],
    queryFn: () => getAllCategoryForAdmin(search, page, limit),
  });
};

export const useOneProductForAdmin = (id?: string | null) => {
  return useQuery({
    queryKey: ["one_product", id],
    queryFn: () => getOneProductByIdForAdmin(id!),
    enabled: !!id,
  });
};

export const useLanguage = () => {
  return useQuery({
    queryKey: ["language"],
    queryFn: getLang,
  });
};

export const useOrderStata = () => {
  return useQuery({
    queryKey: ["orders_stats"],
    queryFn: getOrderStats,
  });
};

export const useOrders = (options: OrderQueryOptions) => {
  return useQuery({
    queryKey: ["orders", options],
    queryFn: () => getAllOrders(options),
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteAllOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllOrders(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders_stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin_dashboard_summary"] });
    },
  });
};

/* ── Telegram WebApp (TMA) & OTP Hooks ──────────────────────── */

export const useTelegramWebAppLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { initData?: string; user?: any }) =>
      telegramWebAppLoginApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
    },
  });
};

export const useSendTelegramOtp = () => {
  return useMutation({
    mutationFn: (data: { identifier: string }) => sendTelegramOtpApi(data),
  });
};

export const useVerifyTelegramOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { identifier: string; code: string }) =>
      verifyTelegramOtpApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
    },
  });
};

export const useTelegramProfile = (telegramId?: string) => {
  return useQuery({
    queryKey: ["telegram_profile", telegramId],
    queryFn: () => getTelegramProfileApi(telegramId!),
    enabled: !!telegramId,
  });
};

export const useMyOrders = (telegramId?: string, phoneNumber?: string) => {
  return useQuery({
    queryKey: ["my_orders", telegramId, phoneNumber],
    queryFn: () => getMyOrdersApi({ telegramId, phoneNumber }),
    enabled: !!telegramId || !!phoneNumber,
  });
};

