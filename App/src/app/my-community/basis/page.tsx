"use client";

import { CardGrid } from "@/components/card-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DocumentService from "@/services/DocumentService";

export default function Page() {
  const initData = [
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
  const [data, setData] = useState(initData);
  const router = useRouter();
  const baseId = "3284c1f1a8104b8796b4d70277b4947a";
  const fethData = async () => {
    const data = await DocumentService.getDocumentByBaseType(baseId);
    const newData = data.map((value) => {
      return {
        title: value.documentAuthor,
        id: value.documentId,
        description: value.documentAuthor,
      };
    });
    setData(newData);
    console.log(data);
  };

  useEffect(() => {
    fethData();
  }, []);
  return (
    <CardGrid
      data={data}
      handleCardClick={(id) => {
        router.push(`/my-community/document/${id}`);
      }}
    />
  );
}
