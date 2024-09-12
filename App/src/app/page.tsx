import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <p className={styles.description}>
        科学社区是一个探索科学的开放平台，输入社区地址进行探索
      </p>
      <input type="text"></input>
    </main>
  );
}
