"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { speak, listen, shuffle } from "@/lib/speak";

const Pic = ({ it }) => <div className="pic">{it.big || it.e}{it.tag && <small>{it.tag}</small>}</div>;

/* ---------- 1. O'rganish ---------- */
function Learn({ items }) {
  const { track } = useStore();
  const [i, setI] = useState(0);
  const it = items[i];
  return (
    <div className="card">
      <div onClick={() => speak(it.en)} className="flash">
        <Pic it={it} />
        <h2 className="word">{it.en}</h2>
        <p>{it.uz}</p>
        <button className="btn">🔊 Tinglash</button>
      </div>
      <div className="row">
        <button className="btn" onClick={() => setI((i - 1 + items.length) % items.length)}>⬅️</button>
        <span>{i + 1} / {items.length}</span>
        <button className="btn" onClick={() => { setI((i + 1) % items.length); track("learn"); }}>➡️</button>
      </div>
    </div>
  );
}

/* ---------- 2. Topib ol (viktorina) ---------- */
function Quiz({ items, onEnd }) {
  const { addCoins, track } = useStore();
  const [rounds] = useState(() => shuffle(items).slice(0, 8));
  const [n, setN] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [earned, setEarned] = useState(0);
  const [res, setRes] = useState(null);
  const cur = rounds[n];
  const opts = useMemo(() => shuffle([cur, ...shuffle(items.filter((x) => x !== cur)).slice(0, 3)]), [n]);
  const listenRound = n % 2 === 1 && !res;
  useEffect(() => { if (listenRound) speak(cur.en); }, [n]);
  const over = lives === 0 || (n === rounds.length - 1 && res);

  const pick = (o) => {
    if (res) return;
    if (o === cur) {
      const g = 5 + (streak + 1 >= 3 ? 5 : 0);
      addCoins(g); track("quiz_ok"); setEarned(earned + g); setStreak(streak + 1); setRes("ok");
    } else { setLives(lives - 1); setStreak(0); setRes("no"); }
    speak(cur.en);
  };
  if (over && res) return (
    <div className="card center">
      <h2>{lives === 0 ? "😢 Jon tugadi!" : "🎉 Barakalla!"}</h2>
      <p>Topgan coinlaring: 🪙 {earned}</p>
      <button className="btn" onClick={onEnd}>🔁 Yana o'ynash</button>
    </div>
  );
  return (
    <div className="card center">
      <div className="stats">{"❤️".repeat(lives)}{"🖤".repeat(3 - lives)} &nbsp; 🔥 {streak} &nbsp; {n + 1}/{rounds.length}</div>
      <p className="hint">3 ta ketma-ket to'g'ri javob = +5 bonus coin!</p>
      {listenRound ? <button className="pic" onClick={() => speak(cur.en)}>🔊</button> : <Pic it={cur} />}
      <p>{listenRound ? "Tinglab, to'g'ri so'zni top" : cur.uz}</p>
      <div className="opts">
        {opts.map((o) => (
          <button key={o.en} className={"btn opt " + (res ? (o === cur ? "ok" : "dim") : "")} onClick={() => pick(o)}>{o.en}</button>
        ))}
      </div>
      {res && <button className="btn go" onClick={() => { setRes(null); setN(n + 1); }}>{res === "ok" ? "✅ To'g'ri! Keyingisi ➡️" : "❌ Xato! Keyingisi ➡️"}</button>}
    </div>
  );
}

/* ---------- 3. Yoz (harflardan so'z yig'ish) ---------- */
function Spell({ items }) {
  const { addCoins, coins, track } = useStore();
  const [order] = useState(() => shuffle(items));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState([]);
  const [msg, setMsg] = useState("");
  const [hint, setHint] = useState(false);
  const it = order[n % order.length];
  const clean = it.en.replace(/[^A-Za-z]/g, "").toUpperCase();
  const tiles = useMemo(() => shuffle(clean.split("").map((c, k) => ({ c, k }))), [n]);
  const word = picked.map((k) => tiles.find((t) => t.k === k).c).join("");
  useEffect(() => {
    if (picked.length === clean.length) {
      if (word === clean) { addCoins(hint ? 5 : 10); track("spell_ok"); setMsg("✅ Ofarin! +" + (hint ? 5 : 10) + " 🪙"); speak(it.en); }
      else { setMsg("❌ Qayta urinib ko'r"); setTimeout(() => { setPicked([]); setMsg(""); }, 900); }
    }
  }, [picked]);
  const done = msg.startsWith("✅");
  return (
    <div className="card center">
      <Pic it={it} />
      <p>{it.uz} — so'zni harflardan yig'!</p>
      <div className="slots">{clean.split("").map((_, k) => <span key={k} className="slot">{word[k] || ""}</span>)}</div>
      <div className="opts">
        {tiles.map((t) => (
          <button key={t.k} className="btn letter" disabled={picked.includes(t.k) || done} onClick={() => setPicked([...picked, t.k])}>{t.c}</button>
        ))}
      </div>
      <div className="row">
        <button className="btn" onClick={() => { setPicked([]); setMsg(""); }}>↩️ Tozalash</button>
        <button className="btn" disabled={hint || coins < 2} onClick={() => { addCoins(-2); setHint(true); }}>💡 Maslahat (-2🪙)</button>
      </div>
      {hint && <p className="hint">Birinchi harf: <b>{clean[0]}</b> (maslahat bilan 5 coin)</p>}
      <h3>{msg}</h3>
      {done && <button className="btn go" onClick={() => { setN(n + 1); setPicked([]); setMsg(""); setHint(false); }}>Keyingisi ➡️</button>}
    </div>
  );
}

/* ---------- 4. Juftini top (xotira) ---------- */
function Match({ items, onEnd }) {
  const { addCoins, track } = useStore();
  const [cards] = useState(() => {
    const pick = shuffle(items).slice(0, 6);
    return shuffle(pick.flatMap((it) => [{ id: it.en + "p", key: it.en, it, t: "p" }, { id: it.en + "w", key: it.en, it, t: "w" }]));
  });
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  const [moves, setMoves] = useState(0);
  useEffect(() => {
    if (open.length !== 2) return;
    setMoves((m) => m + 1);
    const [a, b] = open;
    if (a.key === b.key) { setDone((d) => [...d, a.key]); setOpen([]); speak(a.key); }
    else setTimeout(() => setOpen([]), 800);
  }, [open]);
  const won = done.length === 6;
  useEffect(() => { if (won) { addCoins(moves <= 9 ? 25 : 15); track("match_win"); } }, [won]);
  return (
    <div className="card center">
      <p>Rasm va so'zning juftini top! Yurishlar: {moves}</p>
      <div className="mgrid">
        {cards.map((c) => {
          const show = open.includes(c) || done.includes(c.key);
          return (
            <button key={c.id} className={"mcard " + (done.includes(c.key) ? "ok" : "")} onClick={() => open.length < 2 && !show && setOpen([...open, c])}>
              {show ? (c.t === "p" ? c.it.big || c.it.e : c.it.en) : "❓"}
            </button>
          );
        })}
      </div>
      {won && <><h2>🎉 Ajoyib! +{moves <= 9 ? 25 : 15} 🪙</h2><p className="hint">9 yurishda yutsang — katta bonus!</p><button className="btn go" onClick={onEnd}>🔁 Yana</button></>}
    </div>
  );
}

/* ---------- 5. Ayt (talaffuz) ---------- */
function Say({ items }) {
  const { addCoins, track } = useStore();
  const [order] = useState(() => shuffle(items));
  const [n, setN] = useState(0);
  const [msg, setMsg] = useState("");
  const it = order[n % order.length];
  const check = () => {
    setMsg("🎤 Tinglayapman...");
    listen(
      (alts) => {
        const w = it.en.toLowerCase();
        if (alts.some((a) => a.includes(w))) { addCoins(10); track("say_ok"); setMsg("✅ Ajoyib talaffuz! +10 🪙"); }
        else setMsg(`🙂 Men "${alts[0]}" deb eshitdim. Yana urinib ko'r!`);
      },
      (e) => setMsg(e === "unsupported" ? "Bu brauzer mikrofonni qo'llamaydi. Chrome'da oching." : "Eshitolmadim, qayta urin.")
    );
  };
  return (
    <div className="card center">
      <Pic it={it} />
      <h2 className="word">{it.en}</h2>
      <div className="row">
        <button className="btn" onClick={() => speak(it.en)}>🔊 Tinglash</button>
        <button className="btn go" onClick={check}>🎤 Ayt!</button>
      </div>
      <h3>{msg}</h3>
      <button className="btn" onClick={() => { setN(n + 1); setMsg(""); }}>Keyingisi ➡️</button>
    </div>
  );
}

const MODES = [["learn", "📖 O'rgan"], ["quiz", "❓ Viktorina"], ["spell", "🔤 Yoz"], ["match", "🧩 Juftini top"], ["say", "🎤 Ayt"]];

export default function CategoryPage() {
  const { cat } = useParams();
  const c = CATS.find((x) => x.id === cat);
  const [mode, setMode] = useState("learn");
  const [k, setK] = useState(0);
  if (!c) return <p>Bunday bo'lim yo'q. <Link href="/">Bosh sahifa</Link></p>;
  const restart = () => setK(k + 1);
  return (
    <div style={{ "--c": c.color }}>
      <h1>{c.icon} {c.title}</h1>
      <div className="tabs">
        {MODES.map(([m, label]) => (
          <button key={m} className={"tab " + (mode === m ? "on" : "")} onClick={() => { setMode(m); restart(); }}>{label}</button>
        ))}
      </div>
      {mode === "learn" && <Learn key={k} items={c.items} />}
      {mode === "quiz" && <Quiz key={k} items={c.items} onEnd={restart} />}
      {mode === "spell" && <Spell key={k} items={c.items} />}
      {mode === "match" && <Match key={k} items={c.items} onEnd={restart} />}
      {mode === "say" && <Say key={k} items={c.items} />}
    </div>
  );
}
