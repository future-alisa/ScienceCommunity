import { api } from "./ApiService";

const attemptKey = "science.oauth.attempt";
const authPath = (route: string) => (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/auth/oauth/" + route;

interface OAuthConfig {
  authorizationUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}
function encoded(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...Array.from(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function beginOAuth() {
  const response = await fetch(authPath("config"), { cache: "no-store" });
  if (!response.ok) throw new Error("Alisa 登录尚未配置");
  const config: OAuthConfig = await response.json();
  const verifier = encoded(crypto.getRandomValues(new Uint8Array(32)));
  const state = encoded(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = encoded(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  sessionStorage.setItem(attemptKey, JSON.stringify({ verifier, state, createdAt: Date.now() }));
  const url = new URL(config.authorizationUrl);
  url.search = new URLSearchParams({
    response_type: "code", client_id: config.clientId, redirect_uri: config.redirectUri,
    scope: config.scope, state, code_challenge: challenge, code_challenge_method: "S256",
  }).toString();
  window.location.assign(url.href);
}
export async function finishOAuth(query: URLSearchParams) {
  const saved = sessionStorage.getItem(attemptKey);
  sessionStorage.removeItem(attemptKey);
  const attempt = saved ? JSON.parse(saved) : null;
  if (!attempt || query.get("state") !== attempt.state || Date.now() - attempt.createdAt > 600000
      || Date.now() < attempt.createdAt || query.has("error") || !query.get("code")) {
    throw new Error("授权已取消或登录校验已过期，请重新登录");
  }
  const response = await fetch(authPath("token"), {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify({ code: query.get("code"), verifier: attempt.verifier }),
  });
  if (!response.ok) throw new Error("Alisa 授权登录失败，请重新登录");
  const result = await response.json();
  if (result.token_type?.toLowerCase() !== "bearer" || typeof result.access_token !== "string" || !result.access_token) {
    throw new Error("Alisa 返回的登录凭据无效");
  }
  // Validate the exact token with the community backend before persisting it.
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api").replace(/\/+$/, "");
  const profileResponse = await fetch(base + "/auth/profile", {
    headers: { Authorization: "Bearer " + result.access_token }, cache: "no-store",
  });
  if (!profileResponse.ok) throw new Error("当前账号未获社区访问授权");
  const profile = await profileResponse.json();
  if (profile.code !== 200 || !profile.data?.username) throw new Error("无法确认社区登录身份");
  api.setToken(result.access_token);
  return { token: result.access_token as string, username: profile.data.username as string };
}
