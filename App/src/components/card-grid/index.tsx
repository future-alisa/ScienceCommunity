"use client";
import styles from "./base.module.css";
import { Card, Tag } from "antd";
import CoverImage from "@/components/cover-image";

type CardGridProps = {
  data: MyCard[];
  handleCardClick: (cardId: string) => void;
  onTagClick?: (tag: string) => void;
  kind?: "community" | "document";
};

type MyCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
};

const CardGrid = ({ data, handleCardClick, onTagClick, kind = "document" }: CardGridProps) => {
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
              if (event.target === event.currentTarget && event.key === "Enter") handleCardClick(item.id);
            }}
            hoverable
            cover={
              <CoverImage src={item.imageUrl} title={item.title} description={item.description} kind={kind} priority={index < 6} />
            }
            onClick={() => handleCardClick(item.id)}
          >
            <Meta title={item.title} description={item.description} />
            {!!item.tags?.length && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 12 }}>
              {item.tags.map((tag) => onTagClick
                ? <Tag key={tag} style={{ marginInlineEnd: 0, padding: 0 }}>
                    <button type="button" aria-label={`按标签 ${tag} 筛选`}
                      style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: "0 7px" }}
                      onClick={(event) => { event.stopPropagation(); onTagClick(tag); }}>{tag}</button>
                  </Tag>
                : <Tag key={tag} style={{ marginInlineEnd: 0 }}>{tag}</Tag>)}
            </div>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export { CardGrid };
