import { toast } from "sonner";
import instance from "./real-api";
import { getAccessToken } from "./cookies";
import { ProductQueryOptions } from "../app/products/interface";

const handleApiError = (error: any, defaultMsg: string) => {
  if (error?.response?.status === 401) {
    // Handled globally by Axios response interceptor
    return;
  }
  const msg = error?.response?.data?.message || defaultMsg;
  toast.error(msg);
};

export const getAllProducts = async ({
  search,
  category,
  page,
  limit,
}: ProductQueryOptions) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (page) params.append("page", String(page));
    params.append("limit", String(limit || 12));

    const res = await instance.get(`/product?${params.toString()}`);
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulotlarni yuklashda xatolik yuz berdi");
  }
};

export const getCategoryPreviews = async () => {
  try {
    const res = await instance.get(`/product/previews`);
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Top mahsulotlarni yuklashda xatolik yuz berdi");
  }
};

export const adminLogin = async (data: any) => {
  try {
    const res = await instance.post("/auth/login", data);
    return res.data;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Login yoki parol noto'g'ri";
    toast.error(msg);
    throw error;
  }
};

export const uploadImage = async (data: FormData) => {
  try {
    const token = getAccessToken();
    const res = await instance.post("/file/upload", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Rasm yuklashda xatolik yuz berdi");
    throw error;
  }
};

export const removeImage = async (path: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.delete(`/file/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Rasmni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

export const getAllCategory = async () => {
  try {
    const res = await instance.get("/category");
    return res.data.data;
  } catch (error: any) {
    handleApiError(error, "Kategoriyalarni yuklashda xatolik yuz berdi");
  }
};

export const getAllCategoryForAdmin = async (
  search: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const token = getAccessToken();
    const res = await instance.get(
      `/category/admin?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Kategoriyalarni yuklashda xatolik yuz berdi");
  }
};

export const createProduct = async (data: any) => {
  try {
    const token = getAccessToken();
    const res = await instance.post("/product", JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulot yaratishda xatolik yuz berdi");
    throw error;
  }
};

export const updateProduct = async (data: any, id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.patch(`/product/${id}`, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulotni yangilashda xatolik yuz berdi");
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.delete(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulotni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

export const getOneProductById = async (id: string) => {
  try {
    const res = await instance.get(`/product/${id}`);
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi");
  }
};

export const getOneProductByIdForAdmin = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.get(`/product/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi");
  }
};

export const updateCategory = async (data: any, id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.patch(`/category/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Kategoriyani yangilashda xatolik yuz berdi");
    throw error;
  }
};

export const createCategory = async (data: any) => {
  try {
    const token = getAccessToken();
    const res = await instance.post(`/category`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Kategoriya yaratishda xatolik yuz berdi");
    throw error;
  }
};

export const getOrderStats = async () => {
  try {
    const token = getAccessToken();
    const res = await instance.get(`/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Statistikalarni yuklashda xatolik yuz berdi");
  }
};

export const getAdminDashboardSummary = async () => {
  try {
    const token = getAccessToken();
    const res = await instance.get(`/admin/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Dashboard ma'lumotlarini yuklashda xatolik yuz berdi");
  }
};

export interface OrderQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
}

export const getAllOrders = async (options: OrderQueryOptions = {}) => {
  const params = new URLSearchParams();

  if (options.page) params.append("page", String(options.page));
  if (options.limit) params.append("limit", String(options.limit));
  if (options.search) params.append("search", options.search);

  if (options.status && options.status !== "ALL") {
    params.append("status", options.status);
  }
  if (options.date) {
    params.append("date", options.date);
  }

  try {
    const token = getAccessToken();
    const res = await instance.get(`/order/pagination?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Buyurtmalarni yuklashda xatolik yuz berdi");
  }
};

export const createOrder = async (data: any) => {
  try {
    const res = await instance.post(`/order`, data);
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Buyurtma berishda xatolik yuz berdi");
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.delete(`/order/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Buyurtmani o'chirishda xatolik yuz berdi");
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.patch(
      `/order/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Statusni yangilashda xatolik yuz berdi");
    throw error;
  }
};

export const deleteAllOrders = async () => {
  try {
    const token = getAccessToken();
    const res = await instance.delete(`/order/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Barcha buyurtmalarni o'chirishda xatolik yuz berdi");
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await instance.delete(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    handleApiError(error, "Kategoriyani o'chirishda xatolik yuz berdi");
    throw error;
  }
};

export const getLang = async () => {
  try {
    const res = await instance.get(`/language`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};
