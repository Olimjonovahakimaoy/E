import "./globals.css";
import { Provider } from "@/lib/store";
import Header from "@/components/Header";
export const metadata = { title: "English Kids", description: "Bolalar uchun ingliz tili", icons: { apple: "/icon-192.png" }, appleWebApp: { capable: true, title: "English Kids" } };
export const viewport = { themeColor: "#7c5cff", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="uz"><body><Provider><Header /><main>{children}</main></Provider></body></html>
  );
}
