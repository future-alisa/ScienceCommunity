"use client";
import styles from "./base.module.css";
import { useTheme } from "@/theme/ThemeContext";
import { Card } from "antd";

type CardGridProps = {
  data: MyCard[];
  handleCardClick: (cardId: string) => void;
};

type MyCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

const CardGrid = ({ data, handleCardClick }: CardGridProps) => {
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
                alt="没有找到图片资源"
                src={item.imageUrl || "/community-thumbnail.png"}
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

export { CardGrid };
