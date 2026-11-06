"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Login from "@/components/Login";

export const TASKS = [
  { id: "quiz", ev: "quiz_ok", goal: 3, text: "Viktorinada 3 ta to'g'ri javob ber" },
  { id: "spell", ev: "spell_ok", goal: 2, text: "Yoz o'yinida 2 ta so'z yig'" },
  { id: "match", ev: "match_win", goal: 1, text: "Juftini top o'yinini yut" },
  { id: "say", ev: "say_ok", goal: 2, text: "2 ta so'zni to'g'ri ayt 🎤" },
  { id: "learn", ev: "learn", goal: 8, text: "8 ta yangi so'zni o'rgan 📖" },
];
const C = createContext(null);
const today = () => new Date().toDateString();
const freshTasks = () => {
  const s = Math.floor(Date.now() / 864e5) % TASKS.length;
  return { date: today(), bonus: false, list: [0, 1, 2].map((i) => ({ id: TASKS[(s + i) % TASKS.length].id, progress: 0, done: false })) };
};
const newProfile = (name, phone) => ({ name, phone, coins: 0, owned: [], day: "", ts: 0, tasks: freshTasks() });
const lkey = (p) => "kidsEnglish:" + p;
const readLocal = (phone) => { try { return JSON.parse(localStorage.getItem(lkey(phone))); } catch { return null; } };
async function remoteGet(phone) {
  try {
    const r = await fetch("/api/profile?phone=" + phone);
    if (!r.ok) return { data: null };
    return { data: (await r.json()).data };
  } catch { return { data: null }; }
}
const remoteSet = (p) => fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: p.phone, data: p }) }).catch(() => {});
const newer = (a, b) => (a && (!b || (a.ts || 0) > (b.ts || 0)) ? a : b);

export function Provider({ children }) {
  const [s, setS] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const sRef = useRef(null), tRef = useRef(null), saveRef = useRef(null);

  const cheer = (m) => { setToast(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(""), 3500); };
  const commit = (p) => {
    const q = { ...p, ts: Date.now() };
    sRef.current = q; setS(q);
    try { localStorage.setItem(lkey(q.phone), JSON.stringify(q)); } catch {}
    clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => remoteSet(q), 600);
  };
  const daily = (p) => {
    if (p.day === today()) return p;
    cheer(`🎁 Salom, ${p.name}! Kunlik sovg'a: +5 🪙`);
    return { ...p, coins: p.coins + 5, day: today(), tasks: freshTasks() };
  };

  useEffect(() => {
    (async () => {
      let phone = null;
      try { phone = localStorage.getItem("kidsEnglishUser"); } catch {}
      if (phone) {
        const base = newer((await remoteGet(phone)).data, readLocal(phone));
        if (base) commit(daily(base));
      }
      setReady(true);
    })();
    // eslint-disable-next-line
  }, []);

  const login = async (name, phoneRaw) => {
    const phone = phoneRaw.replace(/\D/g, "");
    setBusy(true);
    let p = newer((await remoteGet(phone)).data, readLocal(phone)) || newProfile(name.trim(), phone);
    try { localStorage.setItem("kidsEnglishUser", phone); } catch {}
    commit(daily(p));
    setBusy(false);
  };
  const logout = () => { try { localStorage.removeItem("kidsEnglishUser"); } catch {} sRef.current = null; setS(null); };

  const addCoins = (n) => {
    const p = sRef.current; if (!p) return;
    commit({ ...p, coins: Math.max(0, p.coins + n) });
    if (n > 0) cheer(`Barakalla, ${p.name}! +${n} 🪙`);
  };
  const buy = (id, cost) => {
    const p = sRef.current;
    if (!p || p.owned.includes(id) || p.coins < cost) return;
    commit({ ...p, coins: p.coins - cost, owned: [...p.owned, id] });
    cheer(`${id} endi sening, ${p.name}! 🎉`);
  };
  const track = (ev, amount = 1) => {
    const p = sRef.current; if (!p) return;
    let coins = p.coins, changed = false; const msgs = [];
    const list = p.tasks.list.map((t) => {
      const d = TASKS.find((x) => x.id === t.id);
      if (t.done || d.ev !== ev) return t;
      changed = true;
      const progress = Math.min(d.goal, t.progress + amount), done = progress >= d.goal;
      if (done) { coins += 10; msgs.push("🎯 Vazifa bajarildi! +10 🪙"); }
      return { ...t, progress, done };
    });
    if (!changed) return;
    let bonus = p.tasks.bonus;
    if (!bonus && list.every((t) => t.done)) { coins += 20; bonus = true; msgs.push("🏆 Bugungi hamma vazifa tugadi! +20 🪙"); }
    commit({ ...p, coins, tasks: { ...p.tasks, list, bonus } });
    if (msgs.length) cheer(`${msgs.join(" ")} Barakalla, ${p.name}!`);
  };
  const addTask = (id) => {
    const p = sRef.current; if (!p || p.tasks.list.some((t) => t.id === id)) return;
    commit({ ...p, tasks: { ...p.tasks, list: [...p.tasks.list, { id, progress: 0, done: false }] } });
  };

  if (!ready) return <p style={{ textAlign: "center", marginTop: 80, fontSize: 40 }}>⏳</p>;
  if (!s) return <Login onLogin={login} busy={busy} />;
  return <C.Provider value={{ ...s, toast, addCoins, buy, track, addTask, logout }}>{children}</C.Provider>;
}
export const useStore = () => useContext(C);
