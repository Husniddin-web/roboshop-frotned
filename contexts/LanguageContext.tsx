// "use client";

// import type React from "react";
// import { createContext, useContext, useState, useEffect } from "react";
// import { useLanguages } from "@/lib/api";

// interface LanguageContextType {
//   currentLanguage: string;
//   setCurrentLanguage: (code: string) => void;
//   languages: unknown;
//   t: (key: string, fallback?: string) => string;
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(
//   undefined
// );

// export function LanguageProvider({ children }: { children: React.ReactNode }) {
//   const [currentLanguage, setCurrentLanguage] = useState<any>("uz");
//   const { data: languages = [] } = useLanguages();

//   // Complete translation system with all static text
//   const translations: Record<string, Record<string, string>> = {
//     uz: {
//       // Header
//       "search.placeholder": "Mahsulotlarni qidirish...",
//       categories: "Kategoriyalar",
//       cart: "Savat",

//       // Hero Section
//       "hero.title": "Arduino Texnologiyalar Dukoni",
//       "hero.description":
//         "Arduino platalari, sensorlar va elektron komponentlar",
//       "hero.button": "Mahsulotlarni ko'rish",

//       // Products
//       "featured.products": "Tavsiya etilgan mahsulotlar",
//       "view.all": "Barchasini ko'rish",
//       "add.to.cart": "Savatga qo'shish",
//       "added.to.cart": "savatga qo'shildi",
//       "products.found": "mahsulot topildi",
//       "loading.products": "Mahsulotlar yuklanmoqda...",
//       "loading.product": "Mahsulot yuklanmoqda...",
//       "product.not.found": "Mahsulot topilmadi",
//       "related.products": "O'xshash mahsulotlar",
//       description: "Tavsif",
//       quantity: "Miqdor",
//       previous: "Oldingi",
//       next: "Keyingi",

//       // Cart
//       "cart.empty": "Savatingiz bo'sh",
//       total: "Jami",
//       "order.now": "Buyurtma berish",

//       // Order Form
//       "full.name": "To'liq ism",
//       "phone.number": "Telefon raqami",
//       notes: "Izohlar",
//       "submit.order": "Buyurtma yuborish",
//       "submitting.order": "Buyurtma yuborilmoqda...",
//       "order.summary": "Buyurtma xulosasi",
//       "order.success": "Buyurtma muvaffaqiyatli yuborildi!",
//       "order.error": "Buyurtma yuborishda xatolik. Qaytadan urinib ko'ring.",
//       submitting: "Yuborilmoqda...",

//       // Content Sections
//       "useful.content": "Foydali ma'lumotlar",
//       "arduino.what": "Arduino nima?",
//       "arduino.what.text":
//         "Arduino - bu ochiq kodli elektron platforma bo'lib, foydalanish oson apparat va dasturiy ta'minot asosida qurilgan. U har qanday kishi tomonidan interaktiv obyektlar yaratish yoki atrof-muhitni sezish va nazorat qilish uchun ishlatilishi mumkin.",
//       "arduino.why": "Nima uchun Arduino?",
//       "arduino.why.text":
//         "Arduino platformasi o'rganish va prototip yaratish uchun juda qulay. Keng jamiyat tomonidan qo'llab-quvvatlanadi va minglab loyihalar va darsliklar mavjud.",

//       // Location & Contact
//       "store.location": "Do'kon manzili",
//       "about.us": "Biz haqimizda",
//       "contact.info": "Aloqa ma'lumotlari",
//       "contact.us.anytime": "Istalgan vaqtda biz bilan bog'laning",
//       address: "Manzil",
//       phone: "Telefon",
//       telegram: "Telegram",
//       "working.hours": "Ish vaqti",
//       "monday.friday": "Dushanba - Juma: 9:00 - 18:00",
//       saturday: "Shanba: 10:00 - 16:00",
//       "sunday.closed": "Yakshanba: Dam olish kuni",
//       "about.text":
//         "Biz Arduino va elektron komponentlar bo'yicha mutaxassis do'konmiz. Mijozlarimizga sifatli mahsulotlar va professional maslahatlar taqdim etamiz.",
//       "call.now": "Hozir qo'ng'iroq qiling",

//       // Footer
//       "footer.text": "© 2024 Arduino Shop. Barcha huquqlar himoyalangan.",
//       "footer.description":
//         "Arduino texnologiyalari va elektron komponentlar bo'yicha yetakchi do'kon",

//       // Admin
//       "admin.login": "Admin kirish",
//       "admin.dashboard": "Admin paneli",
//       welcome: "Xush kelibsiz",
//       logout: "Chiqish",
//       login: "Kirish",
//       email: "Email",
//       password: "Parol",
//       "login.failed": "Kirish amalga oshmadi. Ma'lumotlaringizni tekshiring.",

//       // Admin Sections
//       "products.management": "Mahsulotlar boshqaruvi",
//       "categories.management": "Kategoriyalar boshqaruvi",
//       "orders.analytics": "Buyurtmalar va analitika",
//       "content.management": "Kontent boshqaruvi",
//       "add.product": "Mahsulot qo'shish",
//       "add.category": "Kategoriya qo'shish",
//       "edit.product": "Mahsulotni tahrirlash",
//       "edit.category": "Kategoriyani tahrirlash",
//       "delete.confirm": "Rostdan ham o'chirmoqchimisiz?",
//       save: "Saqlash",
//       cancel: "Bekor qilish",
//       create: "Yaratish",
//       update: "Yangilash",
//       delete: "O'chirish",
//       edit: "Tahrirlash",
//       actions: "Amallar",
//       status: "Holat",
//       active: "Faol",
//       inactive: "Nofaol",
//       price: "Narx",
//       category: "Kategoriya",
//       image: "Rasm",
//       images: "Rasmlar",
//       name: "Nomi",
//       main: "Asosiy",
//       uploading: "Yuklanmoqda...",
//       "upload.images": "Rasm yuklash",
//       "uploading.images": "Rasmlar yuklanmoqda...",
//       "no.images.uploaded": "Hech qanday rasm yuklanmagan",
//       maximum: "Maksimal",
//       "images.allowed": "rasm ruxsat etilgan",
//       "images.uploaded.successfully": "rasm muvaffaqiyatli yuklandi",
//       "upload.failed": "Yuklash amalga oshmadi",
//       "deleting.image": "Rasm o'chirilmoqda...",
//       "image.deleted.successfully": "Rasm muvaffaqiyatli o'chirildi",
//       "delete.failed": "O'chirish amalga oshmadi",

//       // Toast Messages
//       "creating.product": "Mahsulot yaratilmoqda...",
//       "updating.product": "Mahsulot yangilanmoqda...",
//       "deleting.product": "Mahsulot o'chirilmoqda...",
//       "product.created.successfully": "Mahsulot muvaffaqiyatli yaratildi",
//       "product.updated.successfully": "Mahsulot muvaffaqiyatli yangilandi",
//       "product.deleted.successfully": "Mahsulot muvaffaqiyatli o'chirildi",
//       "creating.category": "Kategoriya yaratilmoqda...",
//       "updating.category": "Kategoriya yangilanmoqda...",
//       "deleting.category": "Kategoriya o'chirilmoqda...",
//       "category.created.successfully": "Kategoriya muvaffaqiyatli yaratildi",
//       "category.updated.successfully": "Kategoriya muvaffaqiyatli yangilandi",
//       "category.deleted.successfully": "Kategoriya muvaffaqiyatli o'chirildi",
//       "save.failed": "Saqlash amalga oshmadi",

//       "clear.filters": "tozalash",

//       // Order Status
//       "total.orders": "Jami buyurtmalar",
//       "total.revenue": "Jami daromad",
//       "pending.orders": "Kutilayotgan buyurtmalar",
//       "completed.orders": "Bajarilgan buyurtmalar",
//       "recent.orders": "So'nggi buyurtmalar",
//       "order.id": "Buyurtma ID",
//       "select.category": "Kategorya tanlang",

//       customer: "Mijoz",
//       date: "Sana",
//       "admin.relogin": "Qayta tizimga kiring",
//     },
//     ru: {
//       // Header
//       "search.placeholder": "Поиск товаров...",
//       categories: "Категории",
//       cart: "Корзина",

//       // Hero Section
//       "hero.title": "Магазин Arduino Технологий",
//       "hero.description": "Arduino платы, датчики и электронные компоненты",
//       "hero.button": "Посмотреть товары",

//       // Products
//       "featured.products": "Рекомендуемые товары",
//       "view.all": "Посмотреть все",
//       "add.to.cart": "Добавить в корзину",
//       "added.to.cart": "добавлен в корзину",
//       "products.found": "товаров найдено",
//       "loading.products": "Загрузка товаров...",
//       "loading.product": "Загрузка товара...",
//       "product.not.found": "Товар не найден",
//       "related.products": "Похожие товары",
//       description: "Описание",
//       quantity: "Количество",
//       previous: "Предыдущая",
//       next: "Следующая",

//       // Cart
//       "cart.empty": "Ваша корзина пуста",
//       total: "Итого",
//       "order.now": "Заказать",

//       // Order Form
//       "full.name": "Полное имя",
//       "phone.number": "Номер телефона",
//       notes: "Примечания",
//       "submit.order": "Отправить заказ",
//       "submitting.order": "Отправка заказа...",
//       "order.summary": "Сводка заказа",
//       "order.success": "Заказ успешно отправлен!",
//       "order.error": "Ошибка при отправке заказа. Попробуйте еще раз.",
//       submitting: "Отправка...",

//       // Content Sections
//       "useful.content": "Полезная информация",
//       "arduino.what": "Что такое Arduino?",
//       "arduino.what.text":
//         "Arduino - это платформа с открытым исходным кодом, основанная на простом в использовании аппаратном и программном обеспечении. Она предназначена для всех, кто хочет создавать интерактивные объекты или среды.",
//       "arduino.why": "Почему Arduino?",
//       "arduino.why.text":
//         "Платформа Arduino очень удобна для обучения и создания прототипов. Она поддерживается большим сообществом и имеет тысячи проектов и учебных материалов.",

//       // Location & Contact
//       "store.location": "Адрес магазина",
//       "about.us": "О нас",
//       "contact.info": "Контактная информация",
//       "contact.us.anytime": "Свяжитесь с нами в любое время",
//       address: "Адрес",
//       phone: "Телефон",
//       telegram: "Telegram",
//       email: "Email",
//       "working.hours": "Часы работы",
//       "monday.friday": "Понедельник - Пятница: 9:00 - 18:00",
//       saturday: "Суббота: 10:00 - 16:00",
//       "sunday.closed": "Воскресенье: Выходной",
//       "about.text":
//         "Мы специализированный магазин Arduino и электронных компонентов. Предоставляем качественные товары и профессиональные консультации нашим клиентам.",
//       "call.now": "Позвонить сейчас",

//       // Footer
//       "footer.text": "© 2024 Arduino Shop. Все права защищены.",
//       "footer.description":
//         "Ведущий магазин Arduino технологий и электронных компонентов",

//       // Admin
//       "admin.login": "Вход администратора",
//       "admin.relogin": "Войдите в систему снова",
//       "admin.dashboard": "Панель администратора",
//       welcome: "Добро пожаловать",
//       logout: "Выйти",
//       login: "Войти",
//       password: "Пароль",
//       "login.failed": "Вход не выполнен. Проверьте ваши данные.",

//       // Admin Sections
//       "products.management": "Управление товарами",
//       "categories.management": "Управление категориями",
//       "orders.analytics": "Заказы и аналитика",
//       "content.management": "Управление контентом",
//       "add.product": "Добавить товар",
//       "add.category": "Добавить категорию",
//       "edit.product": "Редактировать товар",
//       "edit.category": "Редактировать категорию",
//       "delete.confirm": "Вы действительно хотите удалить?",
//       save: "Сохранить",
//       cancel: "Отмена",
//       create: "Создать",
//       update: "Обновить",
//       delete: "Удалить",
//       edit: "Редактировать",
//       actions: "Действия",
//       status: "Статус",
//       active: "Активный",
//       inactive: "Неактивный",
//       price: "Цена",
//       category: "Категория",
//       image: "Изображение",
//       images: "Изображения",
//       name: "Название",
//       main: "Основное",
//       uploading: "Загрузка...",
//       "upload.images": "Загрузить изображения",
//       "uploading.images": "Загрузка изображений...",
//       "no.images.uploaded": "Изображения не загружены",
//       maximum: "Максимум",
//       "images.allowed": "изображений разрешено",
//       "images.uploaded.successfully": "изображений успешно загружено",
//       "upload.failed": "Загрузка не удалась",
//       "deleting.image": "Удаление изображения...",
//       "image.deleted.successfully": "Изображение успешно удалено",
//       "delete.failed": "Удаление не удалось",
//       "select.category": "Выберите категорию",

//       // Toast Messages
//       "creating.product": "Создание товара...",
//       "updating.product": "Обновление товара...",
//       "deleting.product": "Удаление товара...",
//       "product.created.successfully": "Товар успешно создан",
//       "product.updated.successfully": "Товар успешно обновлен",
//       "product.deleted.successfully": "Товар успешно удален",
//       "creating.category": "Создание категории...",
//       "updating.category": "Обновление категории...",
//       "deleting.category": "Удаление категории...",
//       "category.created.successfully": "Категория успешно создана",
//       "category.updated.successfully": "Категория успешно обновлена",
//       "category.deleted.successfully": "Категория успешно удалена",
//       "save.failed": "Сохранение не удалось",

//       //filters
//       "clear.filters": "Сбросить",
//       // Order Status
//       "total.orders": "Всего заказов",
//       "total.revenue": "Общий доход",
//       "pending.orders": "Ожидающие заказы",
//       "completed.orders": "Выполненные заказы",
//       "recent.orders": "Последние заказы",
//       "order.id": "ID заказа",
//       customer: "Клиент",
//       date: "Дата",
//     },
//   };

//   const t = (key: string, fallback?: string) => {
//     return translations[currentLanguage]?.[key] || fallback || key;
//   };

//   useEffect(() => {
//     const saved = localStorage.getItem("language");
//     if (saved) {
//       setCurrentLanguage(saved);
//     }
//   }, []);

//   const handleSetLanguage = (code: string) => {
//     setCurrentLanguage(code);
//     localStorage.setItem("language", code);
//   };

//   return (
//     <LanguageContext.Provider
//       value={{
//         currentLanguage,
//         setCurrentLanguage: handleSetLanguage,
//         languages,
//         t,
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (context === undefined) {
//     throw new Error("useLanguage must be used within a LanguageProvider");
//   }
//   return context;
// }
