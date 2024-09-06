export default function page() {
  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <button>基础知识</button>
        <button>案例</button>
        <button>推文</button>
        <button>频道</button>
      </div>
      <div style={styles.midContainer}>
        <input></input>
      </div>
      <div style={styles.rightContainer}></div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },
  leftContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 10,
  },
  midContainer: {
    display: "flex",
    flexDirection: "column",
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
  },
};
