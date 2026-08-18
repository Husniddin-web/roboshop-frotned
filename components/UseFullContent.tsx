"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Tag, ChevronRight, X, Sparkles, Send } from "lucide-react";

const Motion: any = motion;


export default function UsefulContent() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";
  const [selectedArticle, setSelectedArticle] = useState<null | number>(null);

  const articles = [
    {
      id: 1,
      title: isUz ? "Arduino nima va u qanday ishlaydi?" : "Что такое Arduino и как оно работает?",
      tag: isUz ? "Boshlovchilar uchun" : "Для начинающих",
      readTime: isUz ? "3 daqiqa o'qish" : "3 мин чтения",
      image: "/ai-curcuit.jpeg",
      summary: isUz
        ? "Arduino — bu ochiq kodli elektronika platformasi bo'lib, oson dasturlash va sensorlar bilan interaktiv qurilmalar yaratish imkonini beradi."
        : "Arduino — это платформа с открытым исходным кодом, позволяющая легко создавать интерактивные электронные устройства и роботов.",
      fullContent: isUz
        ? `Arduino platformasi mikrokontroller (ATmega328P yoki yangi ARM chiplari) va qulay dasturlash muhiti (Arduino IDE)dan iborat.\n\nUndan nima maqsadda foydalaniladi:\n• Aqlli uy tizimlari (harorat, gaz, yorug'lik avtomatizatsiyasi)\n• Avtonom harakatlanuvchi robotlar va dronlar\n• Ob-havo stantsiyalari va IoT qurilmalari\n\nArduino'ni o'rganish uchun dasturlashni chuqur bilish shart emas: C/C++ asosidagi sodda buyruqlar yordamida birinchi kundan boshlab LED chiroqlarini boshqarish yoki sensor ma'lumotlarini o'qish mumkin.`
        : `Платформа Arduino состоит из микроконтроллера (ATmega328P или новейших ARM чипов) и среды разработки (Arduino IDE).\n\nДля чего применяется:\n• Системы умного дома (климат-контроль, датчики утечки, освещение)\n• Робототехника и беспилотные аппараты\n• Метеостанции и IoT устройства\n\nДля старта не требуется глубоких знаний: понятный синтаксис C/C++ позволяет создать первый проект за считанные минуты.`,
    },
    {
      id: 2,
      title: isUz ? "Nima uchun Arduino robototexnika uchun eng yaxshi tanlov?" : "Почему Arduino идеален для робототехники?",
      tag: isUz ? "Texnologiya & DIY" : "Технологии & DIY",
      readTime: isUz ? "4 daqiqa o'qish" : "4 мин чтения",
      image: "/retro-computer.jpg",
      summary: isUz
        ? "Minglab tayyor kutubxonalar, hamyonbop datchiklar va butun dunyo bo'ylab millionlab muhandislardan iborat ulkan hamjamiyat."
        : "Тысячи готовых библиотек, доступные модули и огромное мировое сообщество инженеров и мейкеров.",
      fullContent: isUz
        ? `Nima uchun Arduino butun dunyo bo'ylab ta'lim va sanoat prototiplashda 1-o'rinda turadi:\n\n1. Katta ekotizim: Har qanday datchik (ultrasonik, harorat, giroskop, kamera) uchun tayyor kutubxonalar mavjud.\n2. Arzon narx va oson topilishi: Do'konimizda barcha qismlar mavjud va ularni bir-biri bilan lehimlashsiz (breadboard orqali) ulash mumkin.\n3. Har qanday yoshga mos: Maktab o'quvchilaridan tortib oliygoh talabalari va startap asoschilarigacha o'z g'oyalarini bir necha soatda haqiqiy qurilmaga aylantirishlari mumkin.`
        : `Почему Arduino занимает лидирующие позиции:\n\n1. Огромная экосистема: готовые библиотеки для сотен сенсоров и сервоприводов.\n2. Доступность: прототипирование на макетных платах без необходимости пайки.\n3. Подходит для любого уровня: от школьных олимпиад до коммерческих прототипов.`,
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen size={13} />
            <span>{t("useful.academy_badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t("useful.content")}
          </h2>
          <p className="text-sm text-zinc-400">
            {isUz
              ? "Robototexnika, sxemotexnika va mikrokontrollerlar bo'yicha foydali qo'llanmalar va maqolalar"
              : "Полезные руководства и статьи по робототехнике, схемотехнике и микроконтроллерам"}
          </p>
        </div>

        {/* Articles Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Motion.div
              key={article.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <div>
                {/* Article Image Frame */}
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/30" />

                  {/* Badges on image */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-400 flex items-center gap-1">
                      <Tag size={11} />
                      {article.tag}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs text-zinc-300 flex items-center gap-1">
                      <Clock size={11} />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Article Text Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-amber-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                <button
                  onClick={() => setSelectedArticle(article.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-amber-400 text-sm font-semibold transition-all duration-200"
                >
                  <span>{t("useful.read_more")}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* Telegram Community Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl glass-panel border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Send size={22} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {isUz ? "Arduino va Robototexnika Hamjamiyati" : "Сообщество робототехники в Telegram"}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                {isUz
                  ? "Savollaringiz bormi? Telegram kanalimizda yangi loyihalar va darsliklar berib boriladi."
                  : "Присоединяйтесь к нашему каналу с готовыми схемами, кодами и поддержкой."}
              </p>
            </div>
          </div>
          <a
            href="https://t.me/roboshop_admin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all whitespace-nowrap"
          >
            <span>{isUz ? "Kanalga a'zo bo'lish" : "Подписаться"}</span>
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      {/* Interactive Modal Drawer for full article reading */}
      <AnimatePresence>
        {selectedArticle !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0f1422] border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {(() => {
                const active = articles.find((a) => a.id === selectedArticle);
                if (!active) return null;
                return (
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
                      <Sparkles size={12} />
                      {active.tag}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 pr-6 leading-snug">
                      {active.title}
                    </h3>
                    <div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                      {active.fullContent}
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors"
                      >
                        {isUz ? "Yopish" : "Закрыть"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

