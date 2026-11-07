"use client";
import styles from "./base.module.css";
import { Card, Tag } from "antd";
import CoverImage from "@/components/cover-image";

type CardGridProps = {
  data: MyCard[];
  handleCardClick: (cardId: string) => void;
  kind?: "community" | "document";
};

type MyCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tag?: string;
};

const CardGrid = ({ data, handleCardClick, kind = "document" }: CardGridProps) => {
  const { Meta } = Card;

  return (
    <div
      className={styles.page}
    >
      <div className={styles.grid}>
        {data.map((item, index) => (
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
              <CoverImage src={item.imageUrl} title={item.title} description={item.description} kind={kind} priority={index < 6} />
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
