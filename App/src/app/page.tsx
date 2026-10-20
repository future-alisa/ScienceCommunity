"use client";
import Link from "next/link";
import { ArrowRightOutlined, BookOutlined, ExperimentOutlined, CommentOutlined } from "@ant-design/icons";
import styles from "./page.module.css";
export default function Home() {
  return <main className={styles.main}>
    <section className={styles.hero}>
      <span className={styles.eyebrow}>一个关于知识与好奇心的社区</span>
      <h1>在这里，<br />让知识彼此连接<span>。</span></h1>
      <p>找到你感兴趣的学科。读一本好书，分享一次发现，<br className={styles.desktopBreak} />和同路人一起，把问题想得更深一点。</p>
      <div className={styles.actions}>
        <Link href="/community" className={styles.primary}>探索学科社区 <ArrowRightOutlined /></Link>
        <Link href="/about" className={styles.secondary}>了解科学社区 <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.subjects}><span>数学</span><span>物理</span><span>计算机</span><span>更多学科，等待探索</span></div>
    </section>
    <section className={styles.features} aria-label="社区内容">
      {[{ icon: <BookOutlined />, title: "建立知识体系", text: "从理论与资料出发，让零散的知识逐渐成为体系。" },
        { icon: <ExperimentOutlined />, title: "连接理论与实践", text: "阅读真实案例与社区文章，从不同视角理解问题。" },
        { icon: <CommentOutlined />, title: "让讨论继续", text: "走进主题频道，提出问题，也分享你的思考。" }].map((item) => <div key={item.title} className={styles.feature}>
          <span className={styles.featureIcon}>{item.icon}</span><h2>{item.title}</h2><p>{item.text}</p>
        </div>)}
    </section>
    <footer className={styles.footer}>保持好奇，知识没有终点。<span>Science Community</span></footer>
  </main>;
}
