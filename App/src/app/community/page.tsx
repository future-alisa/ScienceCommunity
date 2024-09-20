"use client";
import { Card } from "antd";
import styles from "./commnity.module.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
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

  const handleClick = (documentId: string) => {
    router.push("/my-community");
    console.log("test");
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <select>
          <option>最近更新</option>
          <option>访问次数</option>
          <option>用户数量</option>
        </select>
        <select>
          <option>数学</option>
          <option>英语</option>
          <option>物理</option>
        </select>
      </div>
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
    </div>
  );
}
