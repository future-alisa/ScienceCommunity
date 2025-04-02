"use client";
import styles from "./base.module.css";
import { useTheme } from "@/theme/ThemeContext";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type BaseProps = {
  data: MyDocument[];
  handleCardClick: (cardId: string) => void;
};

type MyDocument = {
  title: string;
  id: string;
  description: string;
};

const Base = ({ data, handleCardClick }: BaseProps) => {
  const { theme } = useTheme();
  const { Meta } = Card;

  return (
    <div
      className={styles.page}
      style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
    >
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
            onClick={() => handleCardClick(item.id)}
          >
            <Meta title={item.title} description={item.description} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export { Base };
