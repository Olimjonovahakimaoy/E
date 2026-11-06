"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
export default function Header() {
  const { coins, owned, name, toast, logout } = useStore();
  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {}); }, []);
  return (
    <>
      <header className="head">
        <Link href="/" className="logo">🏠 {name}</Link>
        <div className="stk">{owned.map((o) => <span key={o}>{o}</span>)}</div>
        <div className="coin">🪙 {coins}</div>
        <button className="out" title="Boshqa bola" onClick={logout}>🔄</button>
      </header>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
