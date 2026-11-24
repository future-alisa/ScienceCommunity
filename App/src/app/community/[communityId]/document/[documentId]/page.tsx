"use client";
import { normalizePdfExtract } from "@/util/PdfExtractedDocument";
import { Alert, Button, Form, Popconfirm, Space, Spin, Tag, message } from "antd";
import Link from "next/link";
import TagPicker from "@/components/tag-picker";
import ProposalActions from "@/components/document-proposal/actions";
import DocumentReader from "@/components/document-reader";
import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { DocumentRouteParams } from "@/model/MyRouteParams";
import { Document } from "@/model/Document";
import { useParams, useRouter } from "next/navigation";
import DocumentService from "@/services/DocumentService";
import MemberService from "@/services/MemberService";
import { parseDocument } from "@/util/DocumentContent";
import CoverImage from "@/components/cover-image";

export default function Page() {
  const { communityId, documentId } = useParams<DocumentRouteParams>();
  const router = useRouter();
  const [document, setDocument] = useState<Document>();
  const [value, setValue] = useState<Descendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [savingTags, setSavingTags] = useState(false);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setCanEdit(false); setEditingTags(false); setDocument(undefined);
    Promise.all([DocumentService.getDocumentById(documentId), MemberService.access(communityId).catch(() => undefined)]).then(([document, access]) => {
      if (!active) return;
      if (document.documentCommunityId !== communityId) throw new Error("文档不属于当前社区");
      const content = normalizePdfExtract(parseDocument(document.documentContent));
      setDocument(document); setValue(content);
      setCanEdit(Boolean(access?.membershipId && (access.userId === document.documentAuthorId || access.role === "owner" || access.role === "admin")));
    }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "文档加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, documentId, revision]);
  async function saveTags({ tags }: { tags: string[] }) {
    if (savingTags) return;
    setSavingTags(true);
    try {
      const saved = await DocumentService.updateTags(documentId, tags);
      setDocument((current) => current?.documentId === documentId ? { ...current, tags: saved } : current);
      setEditingTags(false);
      message.success("标签已保存");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "标签保存失败");
    } finally {
      setSavingTags(false);
    }
  }

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
      {document?.documentThumbnailUrl && <CoverImage src={document.documentThumbnailUrl} title={document.documentName} style={{ aspectRatio: "4 / 1", maxHeight: 220, borderRadius: 10, marginBottom: 24 }} />}
      <h1>{document?.documentName}</h1>
      <p>{document?.documentDescription}</p>
      {canEdit && editingTags && <Form layout="vertical" style={{ maxWidth: 540, marginBottom: 16 }} initialValues={{ tags: document?.tags ?? [] }} onFinish={saveTags}>
        <Form.Item name="tags" label="文档标签"><TagPicker kind="document" disabled={savingTags} /></Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={savingTags}>保存标签</Button>
          <Button disabled={savingTags} onClick={() => setEditingTags(false)}>取消</Button>
        </Space>
      </Form>}
      {!editingTags && !!document?.tags?.length && <Space wrap style={{ display: "flex", marginBottom: 16 }}>
        {document.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Space>}
      {canEdit && <Space style={{ marginBottom: 16 }}>
        {!editingTags && <Button disabled={busy} onClick={() => setEditingTags(true)}>{document?.tags?.length ? "编辑标签" : "添加标签"}</Button>}
        <Link href={`/community/${communityId}/document/${documentId}/edit`}>编辑文档</Link>
        <Popconfirm title="确定删除这篇文档？" description="删除后无法恢复。" onConfirm={remove} disabled={busy}><Button danger loading={busy}>删除</Button></Popconfirm>
      </Space>}
      <ProposalActions key={documentId} documentId={documentId} documentUrl={`/community/${communityId}/document/${documentId}`} />
      <DocumentReader key={`${documentId}-${revision}`} value={value} wide />
    </article>
  );
}
