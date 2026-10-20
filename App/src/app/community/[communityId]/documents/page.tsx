"use client";
import { DocumentLibrary } from "@/components/document-library";
import { useParams } from "next/navigation";
import { CommunityRouteParams } from "@/model/MyRouteParams";
export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  return <DocumentLibrary key={communityId} communityId={communityId} />;
}
