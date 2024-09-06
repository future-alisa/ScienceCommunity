import Link from "next/link";

export function MyNav() {
  return (
    <nav style={styles.nav_container}>
      <Link style={styles.nav_link} href="/">Home</Link>
      <Link style={styles.nav_link} href="/community">Community</Link>
      <Link style={styles.nav_link} href="/about">About</Link>
      <Link style={styles.nav_link} href="/login">Sign In</Link>
    </nav>
  );
}

const styles = {
  nav_container: {
    display: "flex",
    justifyContent: "center", // Center items horizontally
    alignItems: "center", // Center items vertically
  },
  nav_link: {
    margin: 10,
  },
};
