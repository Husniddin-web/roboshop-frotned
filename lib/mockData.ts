// Mock data based on Prisma models

export const mockLanguages = [
  {
    id: "1",
    code: "uz",
    name: "O'zbek",
    isDefault: true,
  },
  {
    id: "2",
    code: "ru",
    name: "Русский",
    isDefault: false,
  },
]

export const mockCategories = [
  {
    id: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    translations: [
      {
        id: "1",
        name: "Arduino Platalari",
        categoryId: "1",
        languageId: "uz",
      },
      {
        id: "2",
        name: "Arduino Платы",
        categoryId: "1",
        languageId: "ru",
      },
    ],
  },
  {
    id: "2",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    translations: [
      {
        id: "3",
        name: "Sensorlar",
        categoryId: "2",
        languageId: "uz",
      },
      {
        id: "4",
        name: "Датчики",
        categoryId: "2",
        languageId: "ru",
      },
    ],
  },
  {
    id: "3",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    translations: [
      {
        id: "5",
        name: "Modullar",
        categoryId: "3",
        languageId: "uz",
      },
      {
        id: "6",
        name: "Модули",
        categoryId: "3",
        languageId: "ru",
      },
    ],
  },
  {
    id: "4",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    translations: [
      {
        id: "7",
        name: "Kabellar va Ulagichlar",
        categoryId: "4",
        languageId: "uz",
      },
      {
        id: "8",
        name: "Кабели и Разъемы",
        categoryId: "4",
        languageId: "ru",
      },
    ],
  },
]

export const mockProducts = [
  {
    id: "1",
    price: 25.99,
    categoryId: "1",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[0],
    translations: [
      {
        id: "1",
        name: "Arduino Uno R3",
        description:
          "Arduino Uno R3 - eng mashhur va keng qo'llaniladigan Arduino platasi. Boshlang'ich va professional loyihalar uchun ideal.",
        productId: "1",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Arduino Uno R3",
        description:
          "Arduino Uno R3 - самая популярная и широко используемая плата Arduino. Идеальна для начинающих и профессиональных проектов.",
        productId: "1",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "1",
        url: "/placeholder.svg?height=200&width=280",
        productId: "1",
      },
    ],
  },
  {
    id: "2",
    price: 35.5,
    categoryId: "1",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[0],
    translations: [
      {
        id: "3",
        name: "Arduino Nano",
        description: "Arduino Nano - kichik o'lchamdagi Arduino platasi. Kompakt loyihalar uchun mukammal tanlov.",
        productId: "2",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "4",
        name: "Arduino Nano",
        description: "Arduino Nano - компактная плата Arduino. Отличный выбор для компактных проектов.",
        productId: "2",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "2",
        url: "/placeholder.svg?height=200&width=280",
        productId: "2",
      },
    ],
  },
  {
    id: "3",
    price: 12.75,
    categoryId: "2",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[1],
    translations: [
      {
        id: "5",
        name: "DHT22 Harorat va Namlik Sensori",
        description: "Yuqori aniqlikdagi raqamli harorat va namlik sensori. Arduino loyihalari uchun ideal.",
        productId: "3",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "6",
        name: "DHT22 Датчик Температуры и Влажности",
        description: "Высокоточный цифровой датчик температуры и влажности. Идеален для проектов Arduino.",
        productId: "3",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "3",
        url: "/placeholder.svg?height=200&width=280",
        productId: "3",
      },
    ],
  },
  {
    id: "4",
    price: 8.99,
    categoryId: "2",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[1],
    translations: [
      {
        id: "7",
        name: "Ultrasonic HC-SR04 Masofa Sensori",
        description: "Ultrasonic masofa o'lchash sensori. Robotika va avtomatlashtirish loyihalari uchun.",
        productId: "4",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "8",
        name: "Ультразвуковой Датчик Расстояния HC-SR04",
        description: "Ультразвуковой датчик измерения расстояния. Для проектов робототехники и автоматизации.",
        productId: "4",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "4",
        url: "/placeholder.svg?height=200&width=280",
        productId: "4",
      },
    ],
  },
  {
    id: "5",
    price: 15.25,
    categoryId: "3",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[2],
    translations: [
      {
        id: "9",
        name: "ESP32 WiFi Bluetooth Moduli",
        description: "ESP32 - WiFi va Bluetooth qo'llab-quvvatlovchi kuchli mikrocontroller moduli.",
        productId: "5",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "10",
        name: "ESP32 WiFi Bluetooth Модуль",
        description: "ESP32 - мощный модуль микроконтроллера с поддержкой WiFi и Bluetooth.",
        productId: "5",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "5",
        url: "/placeholder.svg?height=200&width=280",
        productId: "5",
      },
    ],
  },
  {
    id: "6",
    price: 22.8,
    categoryId: "3",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: mockCategories[2],
    translations: [
      {
        id: "11",
        name: "LCD 16x2 Displey Moduli",
        description: "16x2 belgilar LCD displey moduli. Matn va raqamlarni ko'rsatish uchun.",
        productId: "6",
        languageId: "uz",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "12",
        name: "LCD 16x2 Дисплей Модуль",
        description: "16x2 символьный LCD дисплей модуль. Для отображения текста и цифр.",
        productId: "6",
        languageId: "ru",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    images: [
      {
        id: "6",
        url: "/placeholder.svg?height=200&width=280",
        productId: "6",
      },
    ],
  },
]

export const mockOrders = [
  {
    id: "1",
    customerName: "Alisher Karimov",
    phoneNumber: "+998901234567",
    totalAmount: 51.98,
    status: "PENDING",
    notes: "Tezroq yetkazib bering",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    orderItems: [
      {
        id: "1",
        quantity: 2,
        price: 25.99,
        orderId: "1",
        productId: "1",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        product: mockProducts[0],
      },
    ],
  },
  {
    id: "2",
    customerName: "Svetlana Petrova",
    phoneNumber: "+998907654321",
    totalAmount: 47.25,
    status: "CONFIRMED",
    notes: "",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    orderItems: [
      {
        id: "2",
        quantity: 1,
        price: 35.5,
        orderId: "2",
        productId: "2",
        createdAt: "2024-01-14T15:45:00Z",
        updatedAt: "2024-01-14T15:45:00Z",
        product: mockProducts[1],
      },
      {
        id: "3",
        quantity: 1,
        price: 12.75,
        orderId: "2",
        productId: "3",
        createdAt: "2024-01-14T15:45:00Z",
        updatedAt: "2024-01-14T15:45:00Z",
        product: mockProducts[2],
      },
    ],
  },
]

// Mock admin credentials
export const mockAdmin = {
  email: "admin@arduinoshop.uz",
  password: "admin123",
  admin: {
    id: "1",
    email: "admin@arduinoshop.uz",
    fullName: "Arduino Shop Admin",
    logo: null,
    is_creator: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
}
