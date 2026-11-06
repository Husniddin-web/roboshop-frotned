"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MessageSquareWarning, Send, CheckCircle2 } from "lucide-react";

export default function ComplaintForm() {
  const { i18n } = useTranslation();
  const isUz = i18n.language !== "ru";

  const [form, setForm] = useState({ name: "", phone: "+998", orderId: "", text: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.replace(/[^\d+]/g, "");
    if (!/^\+?\d{9,13}$/.test(phone)) {
      toast.error(isUz ? "Telefon raqamini to'g'ri kiriting" : "Введите правильный номер телефона");
      return;
    }
    if (form.text.trim().length < 5) {
      toast.error(isUz ? "Shikoyatingizni batafsilroq yozing" : "Опишите жалобу подробнее");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone }),
      });
      if (res.status === 429) {
        toast.error(isUz ? "Juda ko'p urinish. Birozdan keyin qayta yuboring" : "Слишком много попыток. Попробуйте позже");
        return;
      }
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      toast.error(
        isUz
          ? "Yuborishda xatolik. Iltimos, +998 91 797-99-92 raqamiga qo'ng'iroq qiling"
          : "Ошибка отправки. Позвоните по номеру +998 91 797-99-92"
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10">
        <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">
          {isUz ? "Shikoyatingiz qabul qilindi" : "Ваша жалоба принята"}
        </h2>
        <p className="text-zinc-400">
          {isUz
            ? "Rahmat! Mas'ul xodimimiz tez orada siz bilan bog'lanadi."
            : "Спасибо! Наш сотрудник скоро свяжется с вами."}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/60 transition-colors";

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
          <MessageSquareWarning size={22} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {isUz ? "Shikoyat va takliflar" : "Жалобы и предложения"}
          </h1>
          <p className="text-sm text-zinc-400">
            {isUz ? "Yozganingiz to'g'ridan-to'g'ri rahbariyatga yetib boradi" : "Ваше сообщение попадёт напрямую к руководству"}
          </p>
        </div>
      </div>

      {/* Spam-botlar uchun yashirin maydon */}
      <input type="text" name="website" value={form.website} onChange={update("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label className="block text-sm text-zinc-300 mb-1.5">{isUz ? "Ismingiz (ixtiyoriy)" : "Ваше имя (необязательно)"}</label>
        <input value={form.name} onChange={update("name")} maxLength={80} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1.5">{isUz ? "Telefon raqamingiz *" : "Ваш номер телефона *"}</label>
        <input value={form.phone} onChange={update("phone")} type="tel" inputMode="tel" required className={inputClass} placeholder="+998 90 123 45 67" />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1.5">{isUz ? "Buyurtma raqami (bo'lsa)" : "Номер заказа (если есть)"}</label>
        <input value={form.orderId} onChange={update("orderId")} maxLength={30} className={inputClass} placeholder="#efk77s" />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1.5">{isUz ? "Shikoyatingiz *" : "Ваша жалоба *"}</label>
        <textarea value={form.text} onChange={update("text")} required rows={5} maxLength={2000} className={`${inputClass} resize-y`} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black font-bold py-3.5 transition-colors"
      >
        <Send size={18} />
        {sending ? (isUz ? "Yuborilmoqda..." : "Отправка...") : isUz ? "Yuborish" : "Отправить"}
      </button>
    </form>
  );
}
