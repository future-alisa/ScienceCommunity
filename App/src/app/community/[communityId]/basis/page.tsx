"use client";
import { useParams } from "next/navigation";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import { DocumentLibrary } from "@/components/document-library";
export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  return <DocumentLibrary key={communityId} communityId={communityId} category="base" />;
}
