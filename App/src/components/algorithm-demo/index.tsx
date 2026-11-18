import { Element, Node } from "slate";
import DiningDemo from "./dining-demo";
import BinarySearchDemo, { defaultValues, defaultTarget } from "./binary-search-demo";

export const demoLanguage = "science-demo";
export const demos = [
  { id: "dining-philosophers", title: "哲学家进餐", description: "比较两种争用共享资源的策略", Component: DiningDemo },
  { id: "binary-search", title: "二分查找", description: "观察有序数组如何逐步缩小搜索范围", Component: BinarySearchDemo },
];

export const defaultSearchConfig = { values: defaultValues, target: defaultTarget };

export function validSearchConfig(value: unknown): value is typeof defaultSearchConfig {
  if (!value || typeof value !== "object" || !("values" in value) || !("target" in value)) return false;
  const { values, target } = value;
  return Number.isSafeInteger(target) && Array.isArray(values) && values.length >= 2 && values.length <= 32
    && values.every((item, index) => Number.isSafeInteger(item) && (index === 0 || values[index - 1] < item));
}

export function resolveDemo(element: Element) {
  if (element.type !== "code-block" || element.language !== demoLanguage) return undefined;
  const text = Node.string(element);
  if (text === "dining-philosophers") return { id: text, Component: DiningDemo } as const;
  if (text === "binary-search") return { id: text, config: defaultSearchConfig } as const;
  try {
    const data = JSON.parse(text);
    if (data?.id === "binary-search" && validSearchConfig(data.config)) {
      return { id: "binary-search", config: data.config } as const;
    }
  } catch { /* Preserve unknown demo blocks as text. */ }
  return undefined;
}
