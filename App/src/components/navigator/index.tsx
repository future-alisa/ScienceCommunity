import Link from "next/link";

import styles from "./style.module.css";

export default function Navigator() {
    return (
        <nav className={styles.nav_container}>
          <Link className={styles.nav_link} href="/">Home</Link>
          <Link className={styles.nav_link} href="/community">Community</Link>
          <Link className={styles.nav_link} href="/about">About</Link>
          <Link className={styles.nav_link} href="/login">Sign In</Link>
        </nav>
      );
}