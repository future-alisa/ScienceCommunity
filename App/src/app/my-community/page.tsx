"use client";
import { Card } from "antd";
import styles from "./my-commnity.module.css";

export default function Page() {
  const { Meta } = Card;
  const data = [
    {
      title: "1",
      id: "1",
      description: "description1",
    },
    {
      title: "2",
      id: "2",
      description: "description2",
    },
  ];

  const handleClick = (documentId: string) => {};

  return (
    <div className={styles.grid}>
      <Card
        className={styles.card}
        hoverable
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Meta title="title" description="description" />
      </Card>
    </div>
  );
}
