"use client";
import { Card } from "antd";
import styles from "./commnity.module.css";

export default function Page() {
  const { Meta } = Card;
  const data = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div >
      
      <div className={styles.grid}>
        {data.map((item, index) => (
          <Card
            className={styles.card}
            key={index}
            hoverable
            cover={
              <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              />
            }
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        ))}
      </div>
    </div>
  );
}
