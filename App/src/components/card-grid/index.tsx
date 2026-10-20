"use client";
import styles from "./base.module.css";
import { Card, Tag } from "antd";

type CardGridProps = {
  data: MyCard[];
  handleCardClick: (cardId: string) => void;
};

type MyCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tag?: string;
};

const CardGrid = ({ data, handleCardClick }: CardGridProps) => {
  const { Meta } = Card;

  return (
    <div
      className={styles.page}
    >
      <div className={styles.grid}>
        {data.map((item) => (
          <Card
            className={styles.card}
            key={item.id}
            tabIndex={0}
            role="link"
            aria-label={item.title}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleCardClick(item.id);
            }}
            hoverable
            cover={
              <img
                alt={item.title}
                loading="lazy"
                onError={(event) => {
                  if (!event.currentTarget.src.endsWith("/community-thumbnail.png")) {
                    event.currentTarget.src = "/community-thumbnail.png";
                  }
                }}
                src={item.imageUrl || "/community-thumbnail.png"}
              />
            }
            onClick={() => handleCardClick(item.id)}
          >
            <Meta title={item.title} description={item.description} />
            {item.tag && <Tag style={{ marginTop: 12 }}>{item.tag}</Tag>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export { CardGrid };
