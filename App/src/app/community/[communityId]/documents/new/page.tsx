"use client";
import { DocumentEditor } from "@/components/document-editor";
import { useParams } from "next/navigation";
import { CommunityRouteParams } from "@/model/MyRouteParams";
export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  return <DocumentEditor communityId={communityId} />;
}
