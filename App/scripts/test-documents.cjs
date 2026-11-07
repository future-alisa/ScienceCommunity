const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { createEditor, Transforms, Editor } = require('slate');
const { withHistory, HistoryEditor } = require('slate-history');
function load(file) {
  const filename = require('node:path').resolve(__dirname, '../src', file);
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name.startsWith('.') ? load(require('node:path').relative(require('node:path').join(__dirname, '../src'), require('node:path').resolve(require('node:path').dirname(filename), name + '.ts'))) : require(name), TextEncoder, URL });
  return module.exports;
}
const { parseDocument } = load('util/DocumentContent.ts');
const { toggleBlock, isBlockActive, handleDocumentEnter } = load('components/richtext-editor/editor-action.ts');
const { fromMarkdown, toMarkdown } = load('util/DocumentMarkdown.ts');
const { pasteImages, clipboardImages } = load('components/richtext-editor/paste-images.ts');

test('clipboard images support file and item formats, leaving plain text untouched', () => {
  const image = { type: 'image/png', name: 'paste.png' };
  assert.equal(clipboardImages({ files: [image], items: [] })[0], image);
  assert.equal(clipboardImages({ files: [], items: [{ kind: 'file', type: 'image/png', getAsFile: () => image }] })[0], image);
  assert.equal(clipboardImages({ files: [], items: [] }).length, 0);
});
test('pasted images preserve order, surrounding text and the insertion point during upload', async () => {
  const editor = withHistory(createEditor()); editor.isVoid = n => n.type === 'image';
  editor.children = [{ type: 'paragraph', children: [{ text: 'before after' }] }];
  Transforms.select(editor, { path: [0, 0], offset: 6 });
  const errors = [];
  await pasteImages(editor, [{ name: 'one.png', size: 3 }, { name: 'two.png', size: 3 }], async file => {
    if (file.name === 'one.png') Transforms.insertText(editor, 'typed', { at: { path: [0, 0], offset: 0 } });
    return 'https://files.example/' + file.name;
  }, () => true, text => errors.push(text));
  assert.equal(errors.length, 0);
  assert.deepEqual(editor.children.filter(n => n.type === 'image').map(n => n.name), ['one.png', 'two.png']);
  assert.ok(Editor.string(editor, []).includes('typedbefore'));
  assert.ok(Editor.string(editor, []).includes(' after'));
  assert.equal(Editor.rangeRefs(editor).size, 0);
});
test('failed, oversized and abandoned pastes insert no broken nodes and release bookmarks', async () => {
  const editor = createEditor(); editor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
  Transforms.select(editor, { path: [0, 0], offset: 0 });
  const errors = []; let uploads = 0; let active = true;
  await pasteImages(editor, [{ name: 'large.png', size: 21 * 1024 * 1024 }, { name: 'bad.png', size: 1 }], async () => { uploads++; throw new Error('offline'); }, () => active, text => errors.push(text));
  assert.equal(uploads, 1); assert.equal(errors.length, 2);
  await pasteImages(editor, [{ name: 'gone.png', size: 1 }], async () => { active = false; return 'https://files.example/gone.png'; }, () => active, text => errors.push(text));
  assert.equal(editor.children.some(n => n.type === 'image'), false);
  assert.equal(Editor.rangeRefs(editor).size, 0);
});
test('pasting multiple images over selected text keeps all images', async () => {
  const editor = createEditor(); editor.isVoid = n => n.type === 'image';
  editor.children = [{ type: 'paragraph', children: [{ text: 'before selected after' }] }];
  Transforms.select(editor, { anchor: { path: [0,0], offset: 7 }, focus: { path: [0,0], offset: 15 } });
  await pasteImages(editor, [{ name:'a.png',size:1 },{ name:'b.png',size:1 }], async f => 'https://files.example/'+f.name, () => true, () => assert.fail('Unexpected upload failure'));
  assert.deepEqual(editor.children.filter(n => n.type === 'image').map(n => n.name), ['a.png','b.png']);
  assert.ok(!Editor.string(editor, []).includes('selected'));
});
test('legacy list documents normalize without losing formatting or Chinese content', () => {
  const content = parseDocument(JSON.stringify([{ type: 'list', children: [{ type: 'list-item', children: [{ text: '案例', bold: true }] }] }]));
  assert.equal(content[0].type, 'bulleted-list');
  assert.equal(content[0].children[0].children[0].text, '案例');
  assert.equal(content[0].children[0].children[0].bold, true);
});
test('one schema supports theory, case and article content larger than the old TEXT limit', () => {
  const content = JSON.stringify([{ type: 'paragraph', children: [{ text: '理论案例文章'.repeat(10000) }] }]);
  assert.ok(Buffer.byteLength(content) > 65535);
  assert.equal(parseDocument(content)[0].children[0].text.length, 60000);
});
test('malformed content, invalid marks and oversized payloads are rejected', () => {
  for (const value of [[], [{ type: 'script', children: [{ text: 'x' }] }], [{ type: 'paragraph', children: [{ text: 'x', bold: 'yes' }] }], [{ type: 'heading', level: 9, children: [{ text: 'x' }] }], [{ type: 'paragraph', text: 'mixed', children: [] }]]) {
    assert.throws(() => parseDocument(JSON.stringify(value)));
  }
  assert.throws(() => parseDocument(JSON.stringify([{ type: 'paragraph', children: [{ text: 'x'.repeat(1024 * 1024) }] }])));
});
test('ordered and unordered list states stay distinct and can switch directly', () => {
  const editor = withHistory(createEditor());
  editor.children = [{ type: 'bulleted-list', children: [{ type: 'list-item', children: [{ text: 'item' }] }] }];
  Transforms.select(editor, { path: [0, 0, 0], offset: 1 });
  assert.equal(isBlockActive(editor, 'bulleted-list'), true);
  assert.equal(isBlockActive(editor, 'numbered-list'), false);
  toggleBlock(editor, 'numbered-list');
  assert.equal(editor.children[0].type, 'numbered-list');
  assert.equal(Editor.string(editor, [0]), 'item');
});
test('undo and redo preserve document text', () => {
  const editor = withHistory(createEditor());
  editor.children = [{ type: 'paragraph', children: [{ text: '原文' }] }];
  Transforms.select(editor, { path: [0, 0], offset: 2 });
  editor.insertText('补充');
  HistoryEditor.undo(editor);
  assert.equal(Editor.string(editor, [0]), '原文');
  HistoryEditor.redo(editor);
  assert.equal(Editor.string(editor, [0]), '原文补充');
});
test('Enter on an empty list item exits the list and preserves previous items', () => {
  for (const type of ['bulleted-list', 'numbered-list']) {
    const editor = withHistory(createEditor());
    editor.children = [{ type, children: [{ type: 'list-item', children: [{ text: '保留的条目' }] }, { type: 'list-item', children: [{ text: '' }] }] }];
    Transforms.select(editor, { path: [0, 1, 0], offset: 0 });
    assert.equal(handleDocumentEnter(editor), true);
    assert.equal(editor.children[0].type, type);
    assert.equal(Editor.string(editor, [0]), '保留的条目');
    assert.equal(editor.children[1].type, 'paragraph');
    assert.doesNotThrow(() => parseDocument(JSON.stringify(editor.children)));
  }
});
test('Enter after a heading creates a paragraph without changing the heading', () => {
  const editor = withHistory(createEditor());
  editor.children = [{ type: 'heading', level: 2, children: [{ text: '标题' }] }];
  Transforms.select(editor, { path: [0, 0], offset: 2 });
  assert.equal(handleDocumentEnter(editor), true);
  assert.equal(editor.children[0].type, 'heading');
  assert.equal(editor.children[1].type, 'paragraph');
  assert.equal(Editor.string(editor, [0]), '标题');
  assert.doesNotThrow(() => parseDocument(JSON.stringify(editor.children)));
});
test('all multi-block format switches produce content accepted by the document validator', () => {
  for (const type of ['bulleted-list', 'numbered-list', 'heading', 'block-quote', 'center']) {
    const editor = withHistory(createEditor());
    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }, { type: 'paragraph', children: [{ text: 'two' }] }];
    Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [1, 0], offset: 3 } });
    toggleBlock(editor, type, 2);
    assert.doesNotThrow(() => parseDocument(JSON.stringify(editor.children)));
    assert.equal(Editor.string(editor, []), 'onetwo');
  }
});
test('Markdown round trip preserves headings, code fences, links, images, attachments and document embeds', () => {
  const source = '# 标题\n\n**加粗** 和 [链接](https://example.org/)\n\n- 条目\n\n> 引用\n\n```js\nconst x = 1;\n```\n\n![示意图](https://example.org/image.png)\n\n[附件：资料.pdf](https://example.org/file.pdf)\n\n![[0123456789abcdef0123456789abcdef|原文档]]';
  const value = fromMarkdown(source);
  const restored = fromMarkdown(toMarkdown(value));
  assert.equal(JSON.stringify(restored), JSON.stringify(value));
});
test('Markdown conversion preserves literal syntax and rejects unsafe attachment URLs', () => {
  const original = [{ type: 'paragraph', children: [{ text: '# 普通文字，1. 并非标题 *不加粗*' }] }];
  assert.equal(NodeText(fromMarkdown(toMarkdown(original))), '# 普通文字，1. 并非标题 *不加粗*');
  for (const type of ['image', 'attachment']) assert.throws(() => parseDocument(JSON.stringify([{ type, name:'bad', url:'javascript:alert(1)', children:[{text:''}] }])));
  assert.throws(() => toMarkdown([{ type:'paragraph', children:[{text:'x',underline:true}] }]), /下划线/);
  assert.throws(() => toMarkdown([{ type:'paragraph',align:'center',children:[{text:'x'}] }]), /对齐/);
});
test('document-name embeds resolve to stable IDs and ambiguous names fail explicitly', () => {
  const id='0123456789abcdef0123456789abcdef';
  const value=fromMarkdown('![[线性代数]]',name => name==='线性代数'?{documentId:id,name}:undefined);
  assert.equal(value[0].documentId,id);assert.equal(value[0].type,'document-reference');
  assert.throws(()=>fromMarkdown('![[重复名称]]'),/无法唯一找到/);
});
function NodeText(value) { return value.map(node => node.children.map(child => child.text || '').join('')).join('\n'); }
test('code-block Enter inserts a newline and Ctrl Enter exits to a new paragraph', () => {
  const editor=withHistory(createEditor());editor.children=[{type:'code-block',language:'js',children:[{text:'let x = 1;'}]}];
  Transforms.select(editor,{path:[0,0],offset:10});
  assert.equal(handleDocumentEnter(editor),true);assert.equal(editor.children.length,1);assert.equal(Editor.string(editor,[0]),'let x = 1;\n');
  assert.equal(handleDocumentEnter(editor,true),true);assert.equal(editor.children[1].type,'paragraph');
  assert.doesNotThrow(()=>parseDocument(JSON.stringify(editor.children)));
});
