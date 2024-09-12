export default function Page() {
  return (
    <div style={styles.container}>
      <div style={styles.topContainer}>

      </div>
      <div style={styles.bottomContainer}>
        <button>发送</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    dispaly: "flex",
    flexDirection: "column",
  },
  topContainer: {
    dispaly: "flex",
    flexDirection: "column",
  },
  bottomContainer: {
    dispaly: "flex",
    flexDirection: "row",
  },
};
