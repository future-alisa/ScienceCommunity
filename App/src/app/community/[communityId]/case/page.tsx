"use client";
import styles from "@/app/my-community/case/case.module.css";
import { CardGrid } from "@/components/card-grid";
import { Document } from "@/model/Document";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import DocumentService from "@/services/DocumentService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const caseId = "1a5b4c52169d4228a5b1da149511e717";

export default function Page() {
  const [rawData, setRawData] = useState<Document[]>([]);
  const router = useRouter();
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByTypeAndCommunity(
        communityId,
        caseId
      );
      setRawData(res);
    };
    fetchData();
  }, []);
  const displayData = useMemo(() => {
    return rawData.map((item) => ({
      id: item.documentId,
      description: item.documentDescription,
      imageUrl: item.documentThumbnailUrl,
      title: `文档：${item.documentName}`,
    }));
  }, [rawData]);
  return (
    <CardGrid
      data={displayData}
      handleCardClick={(id) => {
        router.push(`/community/${communityId}/document/${id}`);
      }}
    />
  );
}
