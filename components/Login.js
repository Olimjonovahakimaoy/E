"use client";
import { useState } from "react";
export default function Login({ onLogin, busy }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const ok = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 7;
  return (
    <main className="login">
      <div className="card center" style={{ "--c": "#ffd166" }}>
        <div className="pic">🦉</div>
        <h1>English Kids</h1>
        <p>Ismingni va telefon raqamingni yoz. Shu raqam bilan istalgan telefondan kirsang, coinlaring turadi!</p>
        <input className="inp" placeholder="Ismingni yoz" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="inp" placeholder="Telefon raqam: 90 123 45 67" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn go" disabled={!ok || busy} onClick={() => onLogin(name, phone)}>{busy ? "⏳..." : "Boshlash 🚀"}</button>
        <p className="hint">Bu qurilmada raqam bir marta so'raladi.</p>
      </div>
    </main>
  );
}
