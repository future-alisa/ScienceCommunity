"""Convert the user-supplied PDF to one structured book; retain page facsimiles."""
from pathlib import Path
import argparse
import hashlib
import json
import logging
import re
import unicodedata
import pdfplumber
import pypdfium2 as pdfium

logging.disable(logging.CRITICAL)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Path to the supplied PDF')
source = parser.parse_args().source.resolve(strict=True)
source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
out = Path(__file__).resolve().parents[1] / 'content/reinforcement-learning'
out.mkdir(parents=True, exist_ok=True)
(out / 'pages').mkdir(exist_ok=True)
cache_root = out.parents[1] / 'science_community/community_service/target/rl-pdf' / source_hash
cache_root.mkdir(parents=True, exist_ok=True)
def clean(text):
    return unicodedata.normalize('NFKC', text).translate(str.maketrans('⻉⻓⻅⻢⻛⻆⻣', '贝长见马风角骨'))
def node(kind, text, **kwargs):
    return dict(type=kind, children=[dict(text=text)], **kwargs)
nodes = [
    node('paragraph', '本资料由用户提供的《从贝尔曼方程到现代强化学习》PDF 录入，保留为一本资料，包含 48 章、附录与参考文献。原 PDF 共 102 页。'),
    node('paragraph', '阅读说明：正文为可编辑的 PDF 文字提取版；复杂公式的上下标、表格列序和图示不能由文字提取完整重建。每页均提供原版页面链接用于核对，文末附完整 PDF。代码保留原稿内容，未执行或验证原书算法。'),
]
chapters = []
assets = []
pdf = pdfium.PdfDocument(str(source))
with pdfplumber.open(source) as document:
    for page_index, page in enumerate(document.pages):
        number = page_index + 1
        # Page images preserve all visual material independently of text extraction.
        path = out / 'pages' / f'page-{number:03}.webp'
        pdf[page_index].render(scale=1.8).to_pil().save(path, 'WEBP', quality=90)
        assets.append(dict(key=f'page-{number:03}', path=str(path), mime='image/webp'))
        if number in (1, 4, 5):
            # Cover and original contents are preserved in the facsimiles and attached PDF.
            continue
        if number == 2: nodes.append(node('heading', '前言与全书路线', level=1))
        if number == 6: nodes.append(node('heading', '符号、形状与阅读约定', level=1))
        if number in (97, 98, 99, 100, 102):
            titles = {97:'附录 A：Burn 工程的共同骨架', 98:'附录 B：统一误差账本', 99:'附录 C：算法选择决策表', 100:'参考文献', 102:'结语'}
            nodes.append(node('heading', titles[number], level=1))
        nodes.append(node('paragraph', f'原 PDF 第 {number} 页'))
        nodes.append({'type':'paragraph','children':[{'text':'查看本页原版（公式、图表与代码排版）','url':f'https://source.invalid/page-{number:03}'}]})
        cache = cache_root / f'lines-{number:03}.json'
        if cache.exists():
            lines = json.loads(cache.read_text(encoding='utf-8'))
        else:
            raw = page.extract_text_lines(x_tolerance=1, y_tolerance=3, return_chars=True)
            lines = [dict(text=l['text'],top=l['top'],bottom=l['bottom'],chars=[dict(size=c['size'],fontname=c['fontname']) for c in l['chars']]) for l in raw]
            cache.write_text(json.dumps(lines,ensure_ascii=False),encoding='utf-8')
        lines = [line for line in lines if line['top'] > 38 and line['bottom'] < page.height - 35]
        i = 0
        while i < len(lines):
            line = lines[i]
            text = clean(line['text']).strip()
            if not text or re.fullmatch(r'\d+', text): i += 1; continue
            if re.fullmatch(r'CHAPTER\d+', text.replace(' ','')):
                chapter = int(re.search(r'\d+', text.replace(' ',''))[0])
                i += 1
                title_parts = []
                while i < len(lines) and max(c['size'] for c in lines[i]['chars']) >= 18:
                    title_parts.append(clean(lines[i]['text']).strip()); i += 1
                title = ' '.join(title_parts)
                if not title.startswith(f'第 {chapter} 章'): raise ValueError((number, chapter, title))
                chapters.append(dict(number=chapter,title=title,page=number))
                nodes.append(node('heading', title, level=1))
                continue
            code = any('Mono' in c['fontname'] or 'Consolas' in c['fontname'] for c in line['chars'])
            if code:
                block = []
                while i < len(lines) and any('Mono' in c['fontname'] or 'Consolas' in c['fontname'] for c in lines[i]['chars']):
                    block.append(clean(lines[i]['text'])); i += 1
                nodes.append(node('code-block', '\n'.join(block), language='rust'))
                continue
            if re.match(r'^[1-4]\s+[^.]', text) or text in ['推导中不可省略的条件','为什么它可能有效','泛化从哪里来,又在哪里失效','形状、梯度与实现边界']:
                nodes.append(node('heading', text, level=2))
            else:
                nodes.append(node('paragraph', text))
            i += 1
        if number % 10 == 0: print(f'Prepared {number}/102 pages', flush=True)
assert [c['number'] for c in chapters] == list(range(1,49)), chapters
# The original cover is retained as page-001; the site card uses original typography.
assets.append(dict(key='original-pdf',path=str(source),mime='application/pdf'))
nodes.append(node('heading','原始 PDF 与完整页面索引',level=1))
nodes.append(dict(type='attachment',name='从贝尔曼方程到现代强化学习.pdf',url='https://source.invalid/original-pdf',children=[dict(text='')]))
for number in range(1,103):
    nodes.append(dict(type='paragraph',children=[dict(text=f'原 PDF 第 {number} 页',url=f'https://source.invalid/page-{number:03}')]))
# Managed S3 URLs must use attachment nodes so the reader obtains signed URLs.
nodes = [dict(type='attachment',name=n['children'][0]['text'],url=n['children'][0]['url'],children=[dict(text='')])
         if n['type']=='paragraph' and len(n['children'])==1 and n['children'][0].get('url','').startswith('https://source.invalid/') else n for n in nodes]
result=dict(title='从贝尔曼方程到现代强化学习',pageCount=102,chapterCount=48,sourceSha256=source_hash,chapters=chapters,nodes=nodes,assets=assets)
(out/'prepared-book.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: 102 source pages, {len(chapters)} chapters, {len(nodes)} blocks',flush=True)
