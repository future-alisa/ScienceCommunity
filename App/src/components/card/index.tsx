import React, { useState } from "react";
import styles from "./Card.module.css";

type CardProps = {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({ title, description, image, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={title}
          className={`${styles.image} ${loaded ? styles.loaded : ""}`}
          onLoad={() => {
            console.log("Image Loaded:", image); // 🔍 检查图片是否加载
            setLoaded(true);
          }}
          onError={() => console.error("Image failed to load:", image)} // ❌ 检查图片加载失败
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default Card;
