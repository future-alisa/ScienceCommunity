"use client";

import { CardGrid } from "@/components/card-grid";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DocumentService from "@/services/DocumentService";
import { Document } from "@/model/Document";
import { CommunityRouteParams } from "@/model/MyRouteParams";

const basisId = "3284c1f1a8104b8796b4d70277b4947a";

export default function Page() {
  const [rawData, setRawData] = useState<Document[]>([]);
  const router = useRouter();
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByBasisType(basisId);
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
