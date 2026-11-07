// Run with node scripts/test-auth.cjs; exercises the actual TypeScript services.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function environment(browser = true, fetchResponse) {
  const stored = new Map();
  const requests = [];
  const cache = new Map();
  const globals = {
    process: { env: { NEXT_PUBLIC_USER_API_BASE_URL: 'https://identity.example/gateway' } }, console, AbortController, setTimeout, clearTimeout, URLSearchParams,
    fetch: async (url, options) => {
      requests.push({ url, ...options });
      if (fetchResponse) return fetchResponse(url, options);
      return { ok: true, json: async () => ({ code: 200, data: true }) };
    },
  };
  if (browser) {
    globals.window = {};
    globals.localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) };
  }
  function load(relative) {
    const filename = path.resolve(__dirname, '../src', relative + '.ts');
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    vm.runInNewContext(source, { ...globals, module, exports: module.exports, require: name => load(name.replace('@/', '')) }, { filename });
    return module.exports;
  }
  return { load, requests };
}
test('registration submits email and trims identity without changing password', async () => {
  const env = environment();
  const users = env.load('services/UserService').default;
  await users.signup({ username: ' test-user ', email: ' test@example.invalid ', password: ' secret ' });
  assert.deepEqual(JSON.parse(env.requests[0].body), { username: 'test-user', email: 'test@example.invalid', password: ' secret ' });
  assert.equal(env.requests[0].headers.Authorization, undefined);
});
test('missing email is rejected before calling the broken upstream endpoint', async () => {
  const env = environment();
  await assert.rejects(env.load('services/UserService').default.signup({ username: 'test', email: ' ', password: 'secret' }), /邮箱/);
  assert.equal(env.requests.length, 0);
});
test('logout and account switches invalidate cached tokens across API clients', async () => {
  const env = environment();
  const { api, userApi } = env.load('services/ApiService');
  api.setToken('old-user');
  userApi.setToken(null);
  await api.get('/protected');
  assert.equal(env.requests.at(-1).headers.Authorization, undefined);
  userApi.setToken('new-user');
  await api.get('/protected');
  assert.equal(env.requests.at(-1).headers.Authorization, 'Bearer new-user');
});
test('server-side service usage does not require localStorage', () => {
  const { api } = environment(false).load('services/ApiService');
  assert.equal(api.getToken(), null);
  api.setToken('server-token');
  assert.equal(api.getToken(), 'server-token');
  api.setToken(null);
  assert.equal(api.getToken(), null);
});
test('community deletion uses the backend batch-delete contract with one exact ID', async () => {
  const env = environment();
  await env.load('services/CommunityService').default.deleteCommunity('test-community');
  assert.equal(env.requests[0].url, '/api/community/batch-delete');
  assert.equal(env.requests[0].method, 'DELETE');
  assert.deepEqual(JSON.parse(env.requests[0].body), ['test-community']);
});
test('non-token login responses never authenticate the user', async () => {
  const env = environment();
  const { api, userApi } = env.load('services/ApiService');
  const users = env.load('services/UserService').default;
  for (const result of [null, false, true, '', { token: 'unexpected-shape' }]) {
    userApi.post = async () => result;
    await assert.rejects(users.login({ username: 'test', password: 'secret' }), /用户名或密码错误/);
    assert.equal(api.getToken(), null);
  }
});
test('login service errors report upstream failure without suggesting account deletion', async () => {
  const env = environment();
  const { userApi, ApiError } = env.load('services/ApiService');
  userApi.post = async () => { throw new ApiError('请求失败（500）', 500); };
  await assert.rejects(env.load('services/UserService').default.login({ username: 'deleted-test', password: 'secret' }), error => error.status === 500 && /暂时不可用/.test(error.message));
});

for (const initialToken of [null, 'previous-session']) {
  test(`a delayed 401 from ${initialToken || 'an anonymous request'} cannot erase a new login`, async () => {
    let complete;
    const env = environment(true, () => new Promise(resolve => { complete = resolve; }));
    const { api } = env.load('services/ApiService');
    if (initialToken) api.setToken(initialToken);
    const pending = api.get('/communityuser/access');
    api.setToken('new-session');
    complete({ ok: false, status: 401, json: async () => ({ message: '请先登录' }) });
    await assert.rejects(pending, error => error.status === 401);
    assert.equal(api.getToken(), 'new-session');
  });
}

test('a 401 for the current authenticated session still invalidates its token', async () => {
  const env = environment(true, async () => ({ ok: false, status: 401, json: async () => ({ message: '登录已失效' }) }));
  const { api } = env.load('services/ApiService');
  api.setToken('expired-session');
  await assert.rejects(api.get('/communityuser/access'), error => error.status === 401);
  assert.equal(api.getToken(), null);
});
