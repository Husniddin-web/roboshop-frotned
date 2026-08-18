"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Bot,
  Radio,
  Clock,
  Code2,
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
} from "lucide-react";

const Motion: any = motion;

interface Project {
  id: string;
  tabTitleUz: string;
  tabTitleRu: string;
  badgeUz: string;
  badgeRu: string;
  titleUz: string;
  titleRu: string;
  difficultyUz: string;
  difficultyRu: string;
  diffColor: string;
  timeUz: string;
  timeRu: string;
  software: string;
  image: string;
  descUz: string;
  descRu: string;
  searchKeyword: string;
  components: {
    nameUz: string;
    nameRu: string;
    roleUz: string;
    roleRu: string;
    searchQuery: string;
  }[];
}

const projects: Project[] = [
  {
    id: "smart-car",
    tabTitleUz: "Aqlli 4WD Avtomobil",
    tabTitleRu: "Умная 4WD Машинка",
    badgeUz: "Ommabop DIY Loyiha",
    badgeRu: "Популярный DIY Проект",
    titleUz: "To'siqlardan Avtomatik Qochuvchi Robot Mashina",
    titleRu: "Робот-машинка с авто-объездом препятствий",
    difficultyUz: "Boshlang'ich",
    difficultyRu: "Начальный",
    diffColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    timeUz: "2 - 3 soat",
    timeRu: "2 - 3 часа",
    software: "Arduino IDE / C++",
    image: "/projects/smart_robot.jpg",
    descUz:
      "Ultrasonik masofa o'lchagich va servo radar yordamida yo'lidagi to'siqlarni masofadan aniqlab, mustaqil ravishda xavfsiz yo'nalishni tanlovchi 4WD avtonom robot.",
    descRu:
      "Автономный 4WD робот на Arduino, который с помощью ультразвукового радара сканирует пространство и безопасно объезжает любые препятствия.",
    searchKeyword: "arduino",
    components: [
      {
        nameUz: "Arduino Uno R3 Platasi",
        nameRu: "Плата Arduino Uno R3",
        roleUz: "Boshqaruv mikrokontrolleri",
        roleRu: "Главный управляющий чип",
        searchQuery: "Arduino Uno",
      },
      {
        nameUz: "HC-SR04 Ultrasonik Sensor",
        nameRu: "Ультразвуковой датчик HC-SR04",
        roleUz: "Masofani aniqlash (2cm - 400cm)",
        roleRu: "Замер расстояния (2см - 400см)",
        searchQuery: "HC-SR04",
      },
      {
        nameUz: "L298N Motor Drayveri",
        nameRu: "Драйвер моторов L298N",
        roleUz: "4 ta DC motorni quvvatlash",
        roleRu: "Управление 4 DC моторами",
        searchQuery: "L298N",
      },
      {
        nameUz: "SG90 Mikro Servo Motor",
        nameRu: "Микро сервопривод SG90",
        roleUz: "Ultrasonik sensorni 180° burish",
        roleRu: "Поворот сонара на 180°",
        searchQuery: "SG90",
      },
      {
        nameUz: "4WD Robot Shassi + Motorlar",
        nameRu: "Шасси 4WD для робота + моторы",
        roleUz: "G'ildiraklar va platforma",
        roleRu: "Платформа с редукторами",
        searchQuery: "Shassi",
      },
    ],
  },
  {
    id: "iot-station",
    tabTitleUz: "IoT Ob-havo Stansiyasi",
    tabTitleRu: "IoT Метеостанция",
    badgeUz: "Smart Home & IoT",
    badgeRu: "Smart Home & IoT",
    titleUz: "ESP32 Wi-Fi Aqlli Iqlim va Xavfsizlik Stansiyasi",
    titleRu: "Умная метеостанция с Wi-Fi и Telegram",
    difficultyUz: "O'rta daraja",
    difficultyRu: "Средний",
    diffColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    timeUz: "3 - 4 soat",
    timeRu: "3 - 4 часа",
    software: "ESP32 / Telegram Bot / MQTT",
    image: "/projects/iot_station.jpg",
    descUz:
      "Xonadagi harorat, namlik va gaz sizib chiqishini OLED ekranda real vaqtda chizib beruvchi hamda Telegram orqali ogohlantiruvchi aqlli monitoring tizimi.",
    descRu:
      "Система умного дома на ESP32 с OLED графиками температуры и влажности, датчиком дыма/газа и отправкой тревожных уведомлений в Telegram.",
    searchKeyword: "esp32",
    components: [
      {
        nameUz: "ESP32 Wi-Fi + BLE Moduli",
        nameRu: "Модуль ESP32 Wi-Fi + BLE",
        roleUz: "32-bit Dual-Core IoT mikrokontroller",
        roleRu: "Двухъядерный 32-bit контроллер",
        searchQuery: "ESP32",
      },
      {
        nameUz: "DHT22 / DHT11 Datchigi",
        nameRu: "Датчик DHT22 / DHT11",
        roleUz: "Aniq harorat va namlik o'lchash",
        roleRu: "Точный замер климата",
        searchQuery: "DHT",
      },
      {
        nameUz: "0.96\" I2C OLED Displey",
        nameRu: "OLED дисплей 0.96\" I2C",
        roleUz: "Grafik va ko'rsatkichlarni chiqarish",
        roleRu: "Вывод графиков и данных",
        searchQuery: "OLED",
      },
      {
        nameUz: "MQ-2 Gaz va Tutun Sensori",
        nameRu: "Датчик утечки газа MQ-2",
        roleUz: "Xavfsizlik ogohlantiruvi",
        roleRu: "Контроль безопасности",
        searchQuery: "MQ-2",
      },
      {
        nameUz: "5V Rele Moduli (Relay)",
        nameRu: "Релейный модуль 5V",
        roleUz: "Ventilyatsiya yoki isitgichni yoqish",
        roleRu: "Управление нагрузкой 220V",
        searchQuery: "Relay",
      },
    ],
  },
  {
    id: "robotic-arm",
    tabTitleUz: "Robot-Qo'l Manipulyator",
    tabTitleRu: "Робот-манипулятор",
    badgeUz: "Mexatronika & Ta'lim",
    badgeRu: "Мехатроника & STEM",
    titleUz: "4-DOF Servo Boshqaruvli Robot Manipulyator",
    titleRu: "4-осевой роботизированный манипулятор",
    difficultyUz: "Murakkab",
    difficultyRu: "Продвинутый",
    diffColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    timeUz: "4 - 6 soat",
    timeRu: "4 - 6 часов",
    software: "Arduino Mega / Inverse Kinematics",
    image: "/plata.jpeg",
    descUz:
      "Metall tishli yuqori quvvatli servolar bilan jihozlangan, narsalarni aniq koordinata bo'yicha ushlash, ko'tarish va saralash imkonini beruvchi robotik manipulyator.",
    descRu:
      "Учебный промышленный манипулятор на 4 степеней свободы для захвата и точной сортировки объектов с джойстиковым или программным управлением.",
    searchKeyword: "servo",
    components: [
      {
        nameUz: "Arduino Mega 2560 R3",
        nameRu: "Плата Arduino Mega 2560",
        roleUz: "54 ta raqamli port, ko'p servolar uchun",
        roleRu: "54 цифровых порта для приводов",
        searchQuery: "Arduino Mega",
      },
      {
        nameUz: "4x MG996R Metall Servo",
        nameRu: "4x Сервопривода MG996R",
        roleUz: "11 kg/sm yuqori quvvatli burish momenti",
        roleRu: "Металлический редуктор 11 кг/см",
        searchQuery: "MG996R",
      },
      {
        nameUz: "Dual Joystick Shield Moduli",
        nameRu: "Джойстик-модуль Dual XY",
        roleUz: "Qo'lda silliq boshqarish pult",
        roleRu: "Ручное плавное управление",
        searchQuery: "Joystick",
      },
      {
        nameUz: "5V 5A Quvvat Bloki (Power Supply)",
        nameRu: "Блок питания 5V 5A",
        roleUz: "Servolarni barqaror quvvatlash",
        roleRu: "Стабильное питание приводов",
        searchQuery: "Quvvat",
      },
    ],
  },
];

export default function DiyProjectsHub() {
  const { t, i18n } = useTranslation();
  const isUz = i18n.language === "uz";
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  return (
    <section id="diy-lab" className="py-20 relative overflow-hidden">
      {/* Background Neon ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm shadow-amber-500/10">
            <Bot size={14} className="text-amber-400" />
            <span>{t("projects.badge")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t("projects.title")}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/25 scale-102"
                    : "glass-panel text-zinc-300 hover:text-white hover:border-amber-400/30"
                }`}
              >
                {proj.id === "smart-car" && <Bot size={16} />}
                {proj.id === "iot-station" && <Radio size={16} />}
                {proj.id === "robotic-arm" && <Cpu size={16} />}
                <span>{isUz ? proj.tabTitleUz : proj.tabTitleRu}</span>
              </button>
            );
          })}
        </div>

        {/* Active Project Main Showcase Card */}
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl glass-panel border border-white/15 overflow-hidden shadow-2xl p-6 sm:p-8 lg:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Visual & Quick Stats (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 group bg-[#070a10]">
                  <Image
                    src={activeProject.image}
                    alt={isUz ? activeProject.titleUz : activeProject.titleRu}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-400">
                      {isUz ? activeProject.badgeUz : activeProject.badgeRu}
                    </span>
                  </div>
                </div>

                {/* Meta details strip */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block text-[10px] mb-1">
                      {t("projects.difficulty")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${activeProject.diffColor}`}>
                      {isUz ? activeProject.difficultyUz : activeProject.difficultyRu}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block text-[10px] mb-1">
                      {t("projects.time")}
                    </span>
                    <span className="font-mono font-bold text-white text-[11px]">
                      {isUz ? activeProject.timeUz : activeProject.timeRu}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block text-[10px] mb-1">
                      {t("projects.software")}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 text-[11px] truncate block">
                      {activeProject.software}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Project Description & Parts Checklist (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-3">
                    {isUz ? activeProject.titleUz : activeProject.titleRu}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {isUz ? activeProject.descUz : activeProject.descRu}
                  </p>
                </div>

                {/* Component Parts List */}
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>{t("projects.components_title")}</span>
                  </h4>

                  <div className="space-y-2.5">
                    {activeProject.components.map((comp, cIdx) => (
                      <Link
                        key={cIdx}
                        href={`/products?search=${encodeURIComponent(comp.searchQuery)}`}
                        className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 transition-all text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-white group-hover:text-amber-300 transition-colors block">
                              {isUz ? comp.nameUz : comp.nameRu}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {isUz ? comp.roleUz : comp.roleRu}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>{isUz ? "Topish" : "Найти"}</span>
                          <ChevronRight size={14} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    href={`/products?search=${encodeURIComponent(activeProject.searchKeyword)}`}
                    className="w-full sm:w-auto btn btn-primary px-6 py-3 text-sm font-bold shadow-lg shadow-amber-500/20"
                  >
                    <span>{t("projects.view_parts")}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href="https://t.me/roboshop_admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Send size={15} />
                    <span>{t("projects.get_consultation")}</span>
                  </a>
                </div>
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
