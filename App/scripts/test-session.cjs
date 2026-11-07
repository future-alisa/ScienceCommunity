const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');

test('switching between online accounts persists the new identity and token', () => {
  let current, cursor = 0;
  const deps = [], effects = [], saved = [];
  const hooks = {
    ...React,
    useReducer: () => [current, () => {}],
    useState: () => [true, () => {}],
    useEffect: (effect, values) => {
      const index = cursor++;
      if (!deps[index] || values.some((value, i) => !Object.is(value, deps[index][i]))) effects.push(effect);
      deps[index] = values;
    },
  };
  const storage = {
    saveAuth: (...args) => saved.push(args), clearAuth: () => {},
    getDefaultUser: () => ({ token: '', name: '', email: '', communityId: '' }),
  };
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/context/UserContext.tsx'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, console: { log() {} }, require: name => name === 'react' ? hooks : name === '@/services/StorageService' ? { StorageService: storage } : require(name) });
  function render(name, token) {
    current = { name, token, email: `${name}@example.invalid`, communityId: '', state: 'Online' };
    cursor = 0;
    module.exports.UserContextProvider({ children: null });
    effects.splice(0).forEach(effect => effect());
  }
  render('first', 'token-one');
  render('second', 'token-two');
  assert.equal(saved.length, 2);
  assert.deepEqual(saved[1], ['token-two', 'second', 'second@example.invalid']);
});
