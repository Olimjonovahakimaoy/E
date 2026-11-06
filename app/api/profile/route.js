const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const clean = (p) => String(p || "").replace(/\D/g, "");
const valid = (p) => p.length >= 7 && p.length <= 15;
async function redis(cmd) {
  const r = await fetch(REDIS_URL, { method: "POST", headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, body: JSON.stringify(cmd) });
  return (await r.json()).result;
}
export async function GET(req) {
  const phone = clean(new URL(req.url).searchParams.get("phone"));
  if (!REDIS_URL || !valid(phone)) return Response.json({ data: null }, { status: 503 });
  const v = await redis(["GET", "kids:" + phone]);
  return Response.json({ data: v ? JSON.parse(v) : null });
}
export async function POST(req) {
  const { phone, data } = await req.json();
  const p = clean(phone);
  if (!REDIS_URL || !valid(p) || !data) return Response.json({ ok: false }, { status: 503 });
  const safe = { name: String(data.name || "").slice(0, 40), phone: p, coins: Number(data.coins) || 0, owned: Array.isArray(data.owned) ? data.owned.slice(0, 20) : [], day: data.day, ts: data.ts, tasks: data.tasks };
  await redis(["SET", "kids:" + p, JSON.stringify(safe)]);
  return Response.json({ ok: true });
}
