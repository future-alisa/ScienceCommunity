import { notFound } from "next/navigation";
import type { Descendant } from "slate";
import DocumentReader from "@/components/document-reader";
import { demoLanguage } from "@/components/algorithm-demo";

const document: Descendant[] = [
  { type: "heading", level: 1, children: [{ text: "哲学家进餐：从循环等待到避免死锁" }] },
  { type: "paragraph", children: [{ text: "一群哲学家围桌而坐，每个人需要同时拿到两把相邻的叉子才能进餐。叉子是共享资源，同一把叉子只能由一人持有。" }] },
  { type: "paragraph", children: [{ text: "先选择「所有人先拿左叉」，点几次「单步」，观察每个人何时开始等待。再切换到「先拿编号较小的叉子」并播放，看看是否每个人都能吃完。播放途中可以暂停、继续或调整速度。" }] },
  { type: "code-block", language: demoLanguage, children: [{ text: "dining-philosophers" }] },
  { type: "heading", level: 2, children: [{ text: "为什么统一顺序有效？" }] },
  { type: "paragraph", children: [{ text: "如果每个人都拿着一把叉子等待邻座释放另一把，等待关系就可能绕成一个圈。按编号从小到大拿叉子后，每次等待的叉子编号都大于手里那把。沿着等待链追下去，编号只能增大，因此无法绕回起点。" }] },
  { type: "paragraph", children: [{ text: "把人数改成 3 或 7 再试一次。这个模拟每人只吃一轮，用来比较两种策略下的死锁行为。" }] },
  { type: "heading", level: 2, children: [{ text: "二分查找：用同样的控件观察另一种算法" }] },
  { type: "paragraph", children: [{ text: "换一个查找目标，观察每次比较后，哪些数字被排除。也可以试试数组中没有的数字。" }] },
  { type: "code-block", language: demoLanguage, children: [{ text: "binary-search" }] },
];

export default function DiningPhilosophersDemo() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
    <DocumentReader value={document} />
  </main>;
}
