import { api } from "./ApiService";

type Entry = { url: string; expiresAt: number };
type Waiter = { source: string; token: string; resolve: (url: string) => void; reject: (error: unknown) => void };
const entries = new Map<string, Entry>();
const pending = new Map<string, Promise<string>>();
let account = "", scope = "", restored = "";
let queue: Waiter[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
const storageKey = "science-storage-links-v1";
const lifetime = 8 * 60 * 1000;

async function accountScope(token: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");
}
function persist() {
  try { sessionStorage.setItem(storageKey, JSON.stringify({ scope, entries: Array.from(entries).filter(([, item]) => item.expiresAt > Date.now()).slice(-150) })); } catch { /* Storage may be disabled. */ }
}
async function flush() {
  timer = undefined;
  const batch = queue.splice(0, 50);
  if (queue.length) timer = setTimeout(() => void flush(), 0);
  const active = batch.filter(item => item.token === api.getToken());
  batch.filter(item => item.token !== api.getToken()).forEach(item => item.reject(new Error("登录状态已改变")));
  if (!active.length) return;
  try {
    const result = await api.post<Record<string, string>>("/storage/read-urls", active.map(item => item.source));
    for (const item of active) {
      if (item.token !== api.getToken()) { item.reject(new Error("登录状态已改变")); continue; }
      if (!result[item.source]) { item.reject(new Error("无法获取附件地址")); continue; }
      const entry = { url: result[item.source], expiresAt: Date.now() + lifetime };
      entries.set(item.source, entry); item.resolve(entry.url);
    }
    persist();
  } catch (error) { active.forEach(item => item.reject(error)); }
}

export async function resolveStorageUrl(source: string): Promise<string> {
  const token = api.getToken();
  if (!token) throw new Error("请先登录");
  if (account !== token) { account = token; entries.clear(); pending.clear(); scope = ""; restored = ""; }
  const fingerprint = await accountScope(token);
  if (token !== api.getToken()) throw new Error("登录状态已改变");
  if (restored !== fingerprint) {
    scope = fingerprint; restored = fingerprint;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (saved?.scope === fingerprint && Array.isArray(saved.entries)) {
        for (const [key, value] of saved.entries) if (typeof key === "string" && typeof value?.url === "string" && value.expiresAt > Date.now()) entries.set(key, value);
      }
    } catch { /* Ignore obsolete or unavailable session data. */ }
  }
  const cached = entries.get(source);
  if (cached && cached.expiresAt > Date.now()) return cached.url;
  const key = fingerprint + ":" + source;
  const running = pending.get(key);
  if (running) return running;
  const request = new Promise<string>((resolve, reject) => {
    queue.push({ source, token, resolve, reject });
    if (!timer) timer = setTimeout(() => void flush(), 10);
  });
  pending.set(key, request);
  try { return await request; } finally { pending.delete(key); }
}
