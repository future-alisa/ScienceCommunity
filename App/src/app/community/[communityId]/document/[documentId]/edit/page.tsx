"use client";
import { DocumentEditor } from "@/components/document-editor";
import { useParams } from "next/navigation";
import { DocumentRouteParams } from "@/model/MyRouteParams";
export default function Page() {
  const { communityId, documentId } = useParams<DocumentRouteParams>();
  return <DocumentEditor communityId={communityId} documentId={documentId} />;
}
