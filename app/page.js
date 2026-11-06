"use client";
import Link from "next/link";
import { useState } from "react";
import { CATS, STICKERS } from "@/lib/data";
import { useStore, TASKS } from "@/lib/store";
export default function Home() {
  const { name, coins, owned, buy, tasks, addTask } = useStore();
  const [pick, setPick] = useState(false);
  const left = TASKS.filter((t) => !tasks.list.some((x) => x.id === t.id));
  return (
    <>
      <h1>Salom, {name}! 👋</h1>
      <section className="card" style={{ "--c": "#9be564" }}>
        <h2>📋 Bugungi vazifalar</h2>
        {tasks.list.map((t) => {
          const d = TASKS.find((x) => x.id === t.id);
          return (
            <div key={t.id} className={"task " + (t.done ? "done" : "")}>
              <span>{t.done ? "✅" : "⬜"} {d.text}</span>
              <div className="bar"><i style={{ width: (t.progress / d.goal) * 100 + "%" }} /></div>
              <small>{t.progress}/{d.goal}</small>
            </div>
          );
        })}
        <p className="hint">Har vazifa +10 🪙. Hammasi tugasa +20 🪙 bonus!</p>
        {left.length > 0 && <button className="btn" onClick={() => setPick(!pick)}>➕ O'zimga vazifa tanlayman</button>}
        {pick && <div className="opts">{left.map((t) => <button key={t.id} className="btn" onClick={() => { addTask(t.id); setPick(false); }}>{t.text}</button>)}</div>}
      </section>
      <h2>O'yinni tanla 🎮</h2>
      <div className="grid">
        {CATS.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="tile" style={{ background: c.color }}>
            <span className="ic">{c.icon}</span>{c.title}
          </Link>
        ))}
      </div>
      <h2>🛍️ Sticker do'koni</h2>
      <div className="grid small">
        {STICKERS.map((s) => (
          <button key={s.id} className="tile shop" disabled={owned.includes(s.id) || coins < s.cost} onClick={() => buy(s.id, s.cost)}>
            <span className="ic">{s.id}</span>{owned.includes(s.id) ? "Sening! ✅" : `🪙 ${s.cost}`}
          </button>
        ))}
      </div>
    </>
  );
}
