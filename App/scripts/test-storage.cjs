const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
function client(token = 'fixture', reply = { code: 200, data: { url: 'https://files.example/a.png' } }) {
  const calls = []; const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/services/S3Service.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, FormData, Error,
    process: { env: { NEXT_PUBLIC_API_BASE_URL: 'https://community.example/community/' } },
    require: () => ({ api: { getToken: () => token } }),
    fetch: async (...args) => { calls.push(args); return { ok: true, json: async () => reply }; },
  });
  return { s3: module.exports.s3, calls };
}
test('uploads multipart directly to Java with current token, never JSON or Next route', async () => {
  const { s3, calls } = client();
  assert.equal(await s3.upload(new File(['test'], 'a.png'), 'community'), 'https://files.example/a.png');
  assert.equal(calls[0][0], 'https://community.example/community/storage');
  assert.equal(calls[0][1].headers.Authorization, 'Bearer fixture');
  assert.equal(calls[0][1].headers['Content-Type'], undefined);
  assert.equal(calls[0][1].body.get('communityId'), 'community');
});
test('logged-out uploads and Java business errors are surfaced', async () => {
  const loggedOut = client(null); await assert.rejects(loggedOut.s3.upload(new File(['x'], 'x.txt')), /请先登录/);
  assert.equal(loggedOut.calls.length, 0);
  await assert.rejects(client('fixture', { code: 403, message: '请先加入该社区' }).s3.upload(new File(['x'], 'x.txt')), /请先加入/);
});
test('cover uploads carry their purpose and community without exposing storage credentials', async () => {
  const { s3, calls } = client();
  await s3.upload(new File(['png'], 'cover.png', { type: 'image/png' }), 'community-id', 'community-cover');
  assert.equal(calls[0][1].body.get('purpose'), 'community-cover');
  assert.equal(calls[0][1].body.get('communityId'), 'community-id');
  assert.equal([...calls[0][1].body.keys()].some(key => /secret|accessKey/i.test(key)), false);
});
