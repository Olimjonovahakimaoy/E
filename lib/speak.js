export function speak(t) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "en-US"; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
export function listen(onText, onErr) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!R) return onErr("unsupported");
  const r = new R();
  r.lang = "en-US"; r.maxAlternatives = 3;
  r.onresult = (e) => onText(Array.from(e.results[0]).map((a) => a.transcript.toLowerCase().trim()));
  r.onerror = () => onErr("error");
  r.start();
}
export const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
