"use client";

import { CardGrid } from "@/components/card-grid";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DocumentService from "@/services/DocumentService";
import { CommunityRouteParams } from "@/model/MyRouteParams";

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
const baseId = "3284c1f1a8104b8796b4d70277b4947a";

export default function Page() {
  const params = useParams<CommunityRouteParams>();
  const communityId = params?.communityId;
  const [data, setData] = useState(initData);
  const router = useRouter();

  useEffect(() => {
    const fethData = async () => {
      const data = await DocumentService.getDocumentByBasisType(baseId);
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

    fethData();
  }, []);

  return (
    <CardGrid
      data={data}
      handleCardClick={(id) => {
        router.push(`/community/${communityId}/document/${id}`);
      }}
    />
  );
}
