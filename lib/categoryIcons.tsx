import React from "react";
import {
  Cpu,
  Radio,
  Layers,
  Cable,
  Bot,
  Zap,
  BatteryCharging,
  Wrench,
  Component,
} from "lucide-react";

export function getCategoryIcon(name: string, size = 16) {
  const lower = (name || "").toLowerCase();

  if (
    lower.includes("arduino") ||
    lower.includes("plata") ||
    lower.includes("плат") ||
    lower.includes("kontroller") ||
    lower.includes("контроллер") ||
    lower.includes("esp") ||
    lower.includes("stm")
  ) {
    return <Cpu size={size} className="text-amber-400 flex-shrink-0" />;
  }

  if (
    lower.includes("sensor") ||
    lower.includes("datchik") ||
    lower.includes("датчик") ||
    lower.includes("sonar") ||
    lower.includes("radar")
  ) {
    return <Radio size={size} className="text-cyan-400 flex-shrink-0" />;
  }

  if (
    lower.includes("modul") ||
    lower.includes("модул") ||
    lower.includes("shield") ||
    lower.includes("kengaytma")
  ) {
    return <Layers size={size} className="text-purple-400 flex-shrink-0" />;
  }

  if (
    lower.includes("kabel") ||
    lower.includes("sim") ||
    lower.includes("ulagich") ||
    lower.includes("кабел") ||
    lower.includes("провод") ||
    lower.includes("разъем")
  ) {
    return <Cable size={size} className="text-emerald-400 flex-shrink-0" />;
  }

  if (
    lower.includes("robot") ||
    lower.includes("to'plam") ||
    lower.includes("kit") ||
    lower.includes("набор") ||
    lower.includes("konstruktor")
  ) {
    return <Bot size={size} className="text-rose-400 flex-shrink-0" />;
  }

  if (
    lower.includes("dvigatel") ||
    lower.includes("motor") ||
    lower.includes("двигател") ||
    lower.includes("servo") ||
    lower.includes("drayver") ||
    lower.includes("драйвер")
  ) {
    return <Zap size={size} className="text-yellow-400 flex-shrink-0" />;
  }

  if (
    lower.includes("quvvat") ||
    lower.includes("batareya") ||
    lower.includes("power") ||
    lower.includes("питани") ||
    lower.includes("akkumulyator")
  ) {
    return <BatteryCharging size={size} className="text-lime-400 flex-shrink-0" />;
  }

  if (
    lower.includes("asbob") ||
    lower.includes("lehim") ||
    lower.includes("instrument") ||
    lower.includes("пайка")
  ) {
    return <Wrench size={size} className="text-blue-400 flex-shrink-0" />;
  }

  return <Component size={size} className="text-zinc-400 flex-shrink-0" />;
}
