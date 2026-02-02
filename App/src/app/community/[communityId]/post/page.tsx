"use client";
import styles from "@/app/my-community/post/post.module.css";
import { CardGrid } from "@/components/card-grid";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import DocumentService from "@/services/DocumentService";
import { Document } from "@/model/Document";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const postId = "129f2c1efc9d4e8a821d202bec89f288";

export default function Page() {
  const [rawData, setRawData] = useState<Document[]>([]);
  const router = useRouter();
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  useEffect(() => {
    const fetchData = async () => {
      const res = await DocumentService.getDocumentByBasisType(postId);
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
