const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');
const { webcrypto } = require('node:crypto');
function cache(session = new Map()) {
  let token = 'first-account', clock = Date.now(), fail = false;
  const calls = [];
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname,'../src/services/StorageUrlCache.ts'),'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, Map, Promise, Error, TextEncoder, Uint8Array,
    crypto: webcrypto, setTimeout, clearTimeout, Date: { now: () => clock },
    sessionStorage: { getItem: key => session.get(key), setItem: (key,value) => session.set(key,value) },
    require: () => ({ api: { getToken: () => token, post: async (path, urls) => {
      calls.push({path,urls:[...urls]}); if(fail) throw new Error('offline');
      return Object.fromEntries(urls.map(url => [url, url+'?signed='+calls.length]));
    } } }),
  });
  return { resolve:module.exports.resolveStorageUrl,calls,session,setToken:value=>{token=value;},advance:ms=>{clock+=ms;},fail:value=>{fail=value;} };
}
test('same-screen links batch together and duplicate images share one signature request', async () => {
  const c=cache(); const links=Array.from({length:12},(_,i)=>'https://files.example/'+i+'.png');
  const urls=await Promise.all([...links,links[0]].map(link=>c.resolve(link)));
  assert.equal(c.calls.length,1);assert.equal(c.calls[0].path,'/storage/read-urls');assert.equal(c.calls[0].urls.length,12);
  assert.equal(urls[0],urls[12]);assert.equal(await c.resolve(links[0]),urls[0]);assert.equal(c.calls.length,1);
});
test('page reload reuses valid session links, expiry renews and account switches never reuse them', async () => {
  const c=cache();const url=await c.resolve('https://files.example/image.png');
  const reload=cache(c.session);assert.equal(await reload.resolve('https://files.example/image.png'),url);assert.equal(reload.calls.length,0);
  reload.advance(9*60*1000);await reload.resolve('https://files.example/image.png');assert.equal(reload.calls.length,1);
  reload.setToken('second-account');await reload.resolve('https://files.example/image.png');assert.equal(reload.calls.length,2);
  assert.ok(![...c.session.values()].join('').includes('first-account'));
  reload.setToken(null);await assert.rejects(reload.resolve('https://files.example/image.png'),/请先登录/);
});
test('failed requests release pending entries and can retry', async () => {
  const c=cache();c.fail(true);await assert.rejects(c.resolve('https://files.example/retry.png'),/offline/);
  c.fail(false);assert.ok(await c.resolve('https://files.example/retry.png'));assert.equal(c.calls.length,2);
});
