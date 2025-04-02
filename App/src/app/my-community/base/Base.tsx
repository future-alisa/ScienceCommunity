"use client";
import styles from "@/app/my-community/base/base.module.css";
import Card from "@/components/card";
import { useTheme } from "@/theme/ThemeContext";
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
  const { theme } = useTheme();
  const router = useRouter();
  const handleClick = (documentId: string) => {
    router.push("/my-community/detail");
  };

  useEffect(() => {
    console.log(router);
  }, [router]);

  return (
    <div
      className={styles.page}
      style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
    >
      <div className={styles.grid}>
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            description={item.description}
            image={"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
            onClick={() => handleClick(item.id)}
          ></Card>
        ))}
      </div>
    </div>
  );
};

export { Base };
