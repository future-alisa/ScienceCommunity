"use client";
import styles from "@/app/my-community/post/post.module.css";
import { Base } from "@/components/base";
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
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByPostType("");
    };
    fetchData();
  }, []);
  return (
    <Base
      data={data}
      handleCardClick={() => router.push("/my-community/detail")}
    />
  );
}
