"use client";

import { api } from "@/services/ApiService";
import { Base } from "@/components/base";
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
  const caseId = "1a5b4c52169d4228a5b1da149511e717";
  const postId = "129f2c1efc9d4e8a821d202bec89f288";
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
    <Base
      data={data}
      handleCardClick={(id) => {
        router.push(`/my-community/document/${id}`);
      }}
    />
  );
}
