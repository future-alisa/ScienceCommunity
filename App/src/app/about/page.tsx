"use client";
import Link from "next/link";
export default function About() {
  return <article>
    <p style={{ color: "var(--accent)", fontSize: 12, letterSpacing: ".12em" }}>ABOUT SCIENCE COMMUNITY</p>
    <h1>为好奇心，留一处空间。</h1>
    <p>科学社区是一个面向不同学科的学习与交流空间。我们希望让理论、资料、案例和讨论彼此连接，让每个人都能找到自己的学习路径。</p>
    <h2 style={{ marginTop: 36 }}>从兴趣开始，向理解走近</h2>
    <p>加入感兴趣的科学社区，阅读和积累专业资料，分享文章与实践经验。在主题频道里提出问题，也认真对待他人的思考。</p>
    <Link href="/community" style={{ color: "var(--accent)" }}>探索科学社区 →</Link>
  </article>;
}
