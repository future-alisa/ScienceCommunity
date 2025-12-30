"use client";
import styles from "@/app/my-community/post/post.module.css";
import { CardGrid } from "@/components/card-grid";
import DocumentService from "@/services/DocumentService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const postId = "129f2c1efc9d4e8a821d202bec89f288";

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByPostType(postId);
    };
    fetchData();
  }, []);
  return (
    <CardGrid
      data={data}
      handleCardClick={() => router.push("/my-community/detail")}
    />
  );
}
