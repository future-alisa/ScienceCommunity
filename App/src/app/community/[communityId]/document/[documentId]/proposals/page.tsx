"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProposalList from "@/components/document-proposal/list";

export default function Page() {
  const { communityId, documentId } = useParams<{ communityId: string; documentId: string }>();
  return <section>
    <Link href={`/community/${communityId}/document/${documentId}`}>返回原文</Link>
    <h1>修改提案与合并记录</h1>
    <ProposalList documentId={documentId} />
  </section>;
}
