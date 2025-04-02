"use client";
import styles from "@/app/my-community/post/post.module.css";
import Card from "@/components/card";
import { useRouter } from "next/navigation";

export default function Page() {
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
  const router = useRouter();
  const handleClick = (documentId: string) => {
    router.push("/my-community/detail");
  };
  return (
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
  );
}
