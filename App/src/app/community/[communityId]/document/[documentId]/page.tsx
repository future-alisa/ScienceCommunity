"use client";
import { Alert, Button, Popconfirm, Space, Spin, message } from "antd";
import Link from "next/link";
import { MyEditor } from "@/components/richtext-editor";
import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { DocumentRouteParams } from "@/model/MyRouteParams";
import { Document } from "@/model/Document";
import { useParams, useRouter } from "next/navigation";
import DocumentService from "@/services/DocumentService";
import MemberService from "@/services/MemberService";
import { parseDocument } from "@/util/DocumentContent";

export default function Page() {
  const { communityId, documentId } = useParams<DocumentRouteParams>();
  const router = useRouter();
  const [document, setDocument] = useState<Document>();
  const [value, setValue] = useState<Descendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setCanEdit(false); setDocument(undefined);
    Promise.all([DocumentService.getDocumentById(documentId), MemberService.access(communityId)]).then(([document, access]) => {
      if (!active) return;
      if (document.documentCommunityId !== communityId) throw new Error("文档不属于当前社区");
      const content = parseDocument(document.documentContent);
      setDocument(document); setValue(content);
      setCanEdit(access.userId === document.documentAuthorId || access.role === "owner" || access.role === "admin");
    }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "文档加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, documentId, revision]);
  async function remove() {
    setBusy(true);
    try {
      await DocumentService.deleteDocument(documentId);
      message.success("文档已删除");
      router.push(`/community/${communityId}/documents`);
    } catch (error) { message.error(error instanceof Error ? error.message : "删除失败"); }
    finally { setBusy(false); }
  }
  if (loading) return <Spin />;
  if (error) return <Alert type="error" showIcon message={error} action={<Button onClick={() => setRevision((value) => value + 1)}>重试</Button>} />;
  return (
    <article>
      <h1>{document?.documentName}</h1>
      <p>{document?.documentDescription}</p>
      {canEdit && <Space style={{ marginBottom: 16 }}>
        <Link href={`/community/${communityId}/document/${documentId}/edit`}>编辑文档</Link>
        <Popconfirm title="确定删除这篇文档？" description="删除后无法恢复。" onConfirm={remove} disabled={busy}><Button danger loading={busy}>删除</Button></Popconfirm>
      </Space>}
      <MyEditor key={`${documentId}-${revision}`} initialValue={value} readOnly />
    </article>
  );
}
