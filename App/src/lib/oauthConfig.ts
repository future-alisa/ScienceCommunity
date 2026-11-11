import "server-only";

export function oauthConfig() {
  const issuer = process.env.ALISA_OAUTH_ISSUER?.replace(/\/+$/, "");
  const clientId = process.env.ALISA_OAUTH_CLIENT_ID?.trim();
  const redirectUri = process.env.ALISA_OAUTH_REDIRECT_URI?.trim();
  if (!issuer || !clientId || !redirectUri) throw new Error("OAuth is not configured");
  for (const value of [issuer, redirectUri]) {
    const url = new URL(value);
    const loopback = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.username || url.password || url.hash || url.search ||
        (url.protocol !== "https:" && !(loopback && url.protocol === "http:"))) {
      throw new Error("Invalid OAuth URL");
    }
  }
  return {
    authorizationUrl: issuer + "/oauth2/authorize",
    tokenUrl: issuer + "/oauth2/token",
    clientId, redirectUri,
    scope: process.env.ALISA_OAUTH_SCOPES?.trim() || "science-community:community:read",
  };
}
