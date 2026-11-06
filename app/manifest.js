export default function manifest() {
  return {
    name: "English Kids", short_name: "English Kids", start_url: "/", display: "standalone",
    background_color: "#fff8e7", theme_color: "#7c5cff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
