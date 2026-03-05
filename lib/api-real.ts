import { toast } from "react-toastify";
import instance from "./real-api";
import { getAccessToken } from "./cookies";
import { ProductQueryOptions } from "../app/products/interface";

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
    console.log(error);
    toast.error(
      `${error.response?.data?.message || "Failed to fetch products"}`
    );
  }
};

export const getCategoryPreviews = async () => {
  try {
    const res = await instance.get(`/product/previews`);
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error("Failed to fetch featured products");
  }
};

export const adminLogin = async (data: any) => {
  try {
    const res = await instance.post("/auth/login", data);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
    console.log(error.response.data.message);
  }
};

export const uploadImage = async (data: FormData) => {
  try {
    const token = getAccessToken();

    const res = await instance.post("file/upload", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Upload failed";
    toast.error(errorMessage);
    console.error("Upload error:", errorMessage);
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
    const errorMessage = error?.response?.data?.message || "Deleted failed";
    toast.error(errorMessage);
  }
};

export const getAllCategory = async () => {
  try {
    const res = await instance.get("/category");
    return res.data.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};

export const getAllCategoryForAdmin = async (search: string) => {
  try {
    const res = await instance.get(`/category/admin?search=${search}`);
    return res.data.data || { data: [] };
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
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
    toast.error(`${error.response.data.message}`);
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
    console.log("upload data", data);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
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
    toast.error(`${error.response.data.message}`);
  }
};

export const getOneProductById = async (id: string) => {
  try {
    const res = await instance.get(`/product/${id}`);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};

export const getOneProductByIdForAdmin = async (id: string) => {
  try {
    const res = await instance.get(`/product/admin/${id}`);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};

export const updateCategory = async (data: any, id: string) => {
  try {
    const token = getAccessToken();
    console.log(data, id);
    const res = await instance.patch(`/category/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};

export const createCategory = async (data: any) => {
  try {
    console.log(data);
    const token = getAccessToken();
    const res = await instance.post(`/category`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};

export const getOrderStats = async () => {
  try {
    const res = await instance.get(`/admin/orders`);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
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
    toast.error(`${error.response.data.message}`);
  }
};

export interface OrderQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string; // Add date filter
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
    const res = await instance.get(`/order/pagination?${params.toString()}`);
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
  }
};
export const createOrder = async (data: any) => {
  try {
    const res = await instance.post(`/order`, data);
    return res.data;
  } catch (error: any) {
    toast.error(`${error.response.data.message}`);
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
    toast.error(`${error.response.data.message}`);
  }
};

export const getLang = async () => {
  try {
    const res = await instance.delete(`/language`);
    return res.data;
  } catch (error: any) {
    console.log(error);
    // toast.error(`${error.response.data.message}`);
  }
};
