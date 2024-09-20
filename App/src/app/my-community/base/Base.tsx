"use client";
import styles from "@/app/my-community/base/base.module.css";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type BaseProps = {
  data: MyDocument[];
};

type MyDocument = {
  title: string;
  id: string;
  description: string;
};

const Base = ({ data }: BaseProps) => {
  const { Meta } = Card;
  const router = useRouter();
  const handleClick = (documentId: string) => {
    router.push("/my-community/detail");
  };

  useEffect(() => {
    console.log(router);
  }, [router]);

  return (
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
          onClick={() => handleClick(item.id)}
        >
          <Meta title={item.title} description={item.description} />
        </Card>
      ))}
    </div>
  );
};

export { Base };
