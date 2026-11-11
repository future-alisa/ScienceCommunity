const { test } = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function setup() {
  const store = new Map();
  const requests = [];
  const persisted = [];
  let destination;
  const config = {
    authorizationUrl: "https://identity.example/admin/auth/oauth2/authorize",
    clientId: "web-client",
    redirectUri: "https://community.example/science/auth/oauth/callback",
    scope: "science-community:community:read",
  };
  const module = { exports: {} };
  const source = ts.transpileModule(
    fs.readFileSync(require("node:path").join(__dirname, "../src/services/OAuthService.ts"), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }
  ).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, URL, URLSearchParams, TextEncoder, Uint8Array, Date, crypto: webcrypto,
    btoa: value => Buffer.from(value, "binary").toString("base64"),
    process: { env: { NEXT_PUBLIC_BASE_PATH: "/science", NEXT_PUBLIC_API_BASE_URL: "/science/community-api" } },
    sessionStorage: { setItem: (key, value) => store.set(key, value), getItem: key => store.get(key), removeItem: key => store.delete(key) },
    window: { location: { assign: value => { destination = value; } } },
    require: () => ({ api: { setToken: value => persisted.push(value) } }),
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => url.endsWith("/config") ? config
        : url.endsWith("/token") ? { access_token: "opaque-token", token_type: "Bearer" }
        : { code: 200, data: { username: "alice" } } };
    },
  });
  return { service: module.exports, store, requests, persisted, destination: () => new URL(destination) };
}

test("authorization uses S256 and callback validates identity before saving the token", async () => {
  const env = setup();
  await env.service.beginOAuth();
  const url = env.destination();
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  const attempt = JSON.parse(env.store.get("science.oauth.attempt"));
  const digest = Buffer.from(await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(attempt.verifier))).toString("base64url");
  assert.equal(url.searchParams.get("code_challenge"), digest);
  const result = await env.service.finishOAuth(new URLSearchParams({ state: attempt.state, code: "authorization-code" }));
  assert.equal(result.username, "alice");
  assert.equal(JSON.parse(env.requests[1].options.body).verifier, attempt.verifier);
  assert.equal(env.requests[2].options.headers.Authorization, "Bearer opaque-token");
  assert.deepEqual(env.persisted, ["opaque-token"]);
  await assert.rejects(env.service.finishOAuth(new URLSearchParams({ state: attempt.state, code: "authorization-code" })));
});

test("mismatched state and expired attempts cannot exchange codes", async () => {
  for (const expired of [false, true]) {
    const env = setup();
    await env.service.beginOAuth();
    const attempt = JSON.parse(env.store.get("science.oauth.attempt"));
    if (expired) {
      attempt.createdAt = Date.now() - 600001;
      env.store.set("science.oauth.attempt", JSON.stringify(attempt));
    }
    await assert.rejects(env.service.finishOAuth(new URLSearchParams({
      state: expired ? attempt.state : "attacker-state", code: "authorization-code",
    })));
    assert.equal(env.requests.length, 1);
    assert.deepEqual(env.persisted, []);
  }
});
