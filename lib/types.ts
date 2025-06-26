export interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
}

export interface Category {
  id: string
  translations: CategoryTranslation[]
}

export interface CategoryTranslation {
  id: string
  name: string
  categoryId: string
  languageId: string
}

export interface Product {
  id: string
  price: number
  categoryId: string
  isActive: boolean
  category: Category
  translations: ProductTranslation[]
  images: ProductImage[]
}

export interface ProductTranslation {
  id: string
  name: string
  description?: string
  productId: string
  languageId: string
}

export interface ProductImage {
  id: string
  url: string
  productId: string
}

export interface Order {
  id: string
  customerName: string
  phoneNumber: string
  totalAmount: number
  status: OrderStatus
  notes?: string
  createdAt: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string
  product: Product
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface Admin {
  id: string
  email: string
  password: string
  fullName: string
  logo?: string
  is_creator: boolean
}
