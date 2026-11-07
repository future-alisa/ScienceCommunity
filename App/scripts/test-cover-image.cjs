const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
function component() {
  let states = [], cursor = 0, resolved = '', status = 'loading';
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/components/cover-image/index.tsx'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name === 'react'
    ? { useState: initial => { const index = cursor++; if (!(index in states)) states[index] = initial; return [states[index], value => { states[index] = value; }]; } }
    : name === '@/components/storage-image' ? { useStorageResource: () => ({url: resolved, status}) } : require(name) });
  return { render: props => { cursor = 0; return module.exports.default(props); }, theme: module.exports.coverTheme,
    resolve: (url, nextStatus = 'ready') => { resolved = url; status = nextStatus; } };
}
test('missing covers render an accessible, correctly sized default for either entity', () => {
  const cover = component();
  for (const kind of ['community','document']) {
    const output = cover.render({ title:'数学',kind });
    assert.equal(output.type,'svg'); assert.equal(output.props.role,'img');
    assert.equal(output.props['aria-label'],'数学默认封面');
    assert.equal(output.props.style.aspectRatio,'2 / 1');
  }
});
test('a failed custom image falls back and a replacement image can recover', () => {
  const cover=component(); cover.resolve('https://files.example/first.png');
  const first=cover.render({title:'文档',src:'first'});assert.equal(first.type,'span');
  first.props.children.props.onError();assert.equal(cover.render({title:'文档',src:'first'}).type,'svg');
  cover.resolve('https://files.example/replacement.png');assert.equal(cover.render({title:'文档',src:'replacement'}).type,'span');
});
test('pending signatures and image downloads never display a misleading default cover', () => {
  const cover=component();
  let output=cover.render({title:'01 函数、极限与连续',src:'stored-cover'});
  assert.equal(output.type,'span'); assert.equal(output.props['aria-busy'],true);
  assert.ok(!output.props.children);
  cover.resolve('https://files.example/signed.png');
  output=cover.render({title:'01 函数、极限与连续',src:'stored-cover'});
  assert.equal(output.props.children.props.style.opacity,0);
  output.props.children.props.onLoad();
  output=cover.render({title:'01 函数、极限与连续',src:'stored-cover'});
  assert.equal(output.props['aria-busy'],false); assert.equal(output.props.children.props.style.opacity,1);
  cover.resolve('https://files.example/refreshed-signature.png');
  assert.equal(cover.render({title:'01 函数、极限与连续',src:'stored-cover'}).props.children.props.style.opacity,1);
  cover.resolve('', 'error');assert.equal(cover.render({title:'01 函数、极限与连续',src:'stored-cover'}).type,'svg');
});
test('subject-specific defaults distinguish communities using title and description', () => {
  const cover=component();
  assert.equal(cover.theme('sss 数学相关内容').label,'MATHEMATICS');
  assert.equal(cover.theme('3 物理相关内容').label,'PHYSICS');
  assert.equal(cover.theme('计算机科学与技术').label,'COMPUTER SCIENCE');
  assert.equal(cover.theme('其他学科').label,'SCIENCE COMMUNITY');
});
