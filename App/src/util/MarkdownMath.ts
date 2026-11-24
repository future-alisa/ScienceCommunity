import type { TokenizerAndRendererExtension } from "marked";

// Markdown code spans and fences are consumed by Marked before its inline math tokenizer sees them.
const inlineMath = /^(?:\\\(([^\n]+?)\\\)|\$(?![\s$])((?:\\[^\n]|[^$\\\n`])+?)(?<!\s)\$(?![\d$]))/;
const blockMath = /^(?: {0,3}\$\$([\s\S]+?)\$\$| {0,3}\\\[([\s\S]+?)\\\])[ \t]*(?=\n|$)/;

export function readMath(source: string, display = false) {
  if (!display && /^\$\d+(?:[.,]\d+)?[，。；！？、]/.test(source)) return;
  const match = (display ? blockMath : inlineMath).exec(source);
  if (!match) return;
  const formula = (match[1] ?? match[2])?.trim();
  if (formula) return { raw: match[0], formula };
}

export const mathExtensions: TokenizerAndRendererExtension[] = [
  {
    name: "math-block", level: "block", start: (source) => source.search(/(?:^|\n) {0,3}(?:\$\$|\\\[)/),
    tokenizer(source) {
      const math = readMath(source, true);
      if (math) return { type: "math-block", ...math };
    },
  },
  {
    name: "math-inline", level: "inline", start: (source) => source.search(/[\\$]/),
    tokenizer(source) {
      const math = readMath(source);
      if (math) return { type: "math-inline", ...math };
    },
  },
];
