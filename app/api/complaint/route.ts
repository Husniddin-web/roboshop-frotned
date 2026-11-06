import { NextResponse } from "next/server";

// Vercel sozlamalarida (Environment Variables) qo'yiladi, kodda emas:
//   TELEGRAM_BOT_TOKEN       — BotFather bergan token
//   TELEGRAM_COMPLAINT_CHAT_ID — shikoyatlar tushadigan guruh ID si
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_COMPLAINT_CHAT_ID;

// Oddiy spam himoyasi: bitta IP dan 10 daqiqada ko'pi bilan 3 ta shikoyat
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // "website" maydoni odamga ko'rinmaydi — uni faqat spam-botlar to'ldiradi
  if (body?.website) return NextResponse.json({ ok: true });

  const name = String(body?.name || "").trim().slice(0, 80);
  const phone = String(body?.phone || "").replace(/[^\d+]/g, "");
  const text = String(body?.text || "").trim();
  const orderId = String(body?.orderId || "").trim().slice(0, 30);

  if (!/^\+?\d{9,13}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "phone" }, { status: 400 });
  }
  if (text.length < 5 || text.length > 2000) {
    return NextResponse.json({ ok: false, error: "text" }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });
  }

  const date = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" });
  const message = [
    "⚠️ <b>Yangi shikoyat</b>",
    "",
    name ? `👤 Ism: ${escapeHtml(name)}` : null,
    `📞 Telefon: ${escapeHtml(phone)}`,
    orderId ? `📦 Buyurtma: ${escapeHtml(orderId)}` : null,
    `🕒 Sana: ${date}`,
    "",
    `💬 ${escapeHtml(text)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" }),
    });
    if (!tg.ok) throw new Error(String(tg.status));
  } catch {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
