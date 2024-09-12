import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <p>进入社区</p>
      <input placeholder="搜索"></input>
    </main>
  );
}
