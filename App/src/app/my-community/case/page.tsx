"use client";
import styles from "@/app/my-community/case/case.module.css";
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
  const caseId = "1a5b4c52169d4228a5b1da149511e717";
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByCaseType(caseId);
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
