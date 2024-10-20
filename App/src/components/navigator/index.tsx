import Link from "next/link";

import styles from "./style.module.css";

export default function Navigator() {
  return (
    <nav className={styles.nav_container}>
      <div className={styles.nav_left}>

      </div>
      <div className={styles.nav_middle}>
        <Link className={styles.nav_link} href="/">
          Home
        </Link>
        <Link className={styles.nav_link} href="/community">
          Community
        </Link>
        <Link className={styles.nav_link} href="/about">
          About
        </Link>
      </div>

      <div className={styles.nav_right}>
        <Link className={styles.nav_link} href="/signin">
          Sign In
        </Link>
      </div>
    </nav>
  );
}
