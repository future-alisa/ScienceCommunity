"use client";
import { Alert, Button, Empty, Input, Popconfirm, Select, Space, Spin, Table, message } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CardGrid } from "@/components/card-grid";
import { Document } from "@/model/Document";
import { Category } from "@/model/Category";
import DocumentService from "@/services/DocumentService";
import MemberService, { CommunityAccess } from "@/services/MemberService";
import { useRouter } from "next/navigation";

export const categoryLabel = (name: string) => ({ base: "理论与资料", case: "案例", post: "文章" }[name] || name);
export function DocumentLibrary({ communityId, category, management = false }: { communityId: string; category?: string; management?: boolean }) {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [access, setAccess] = useState<CommunityAccess>();
  const [query, setQuery] = useState("");
  const [typeId, setTypeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setDocuments([]); setAccess(undefined);
    Promise.all([DocumentService.getCategories(), MemberService.access(communityId)]).then(async ([categories, access]) => {
      if (!active) return;
      setCategories(categories); setAccess(access);
      if (!access.membershipId) throw new Error("请先加入该社区后查看资料");
      const selected = category ? categories.find((item) => item.categoryName === category)?.categoryId : typeId;
      if (category && !selected) throw new Error("该资料分类尚未配置，请联系管理员");
      const documents = await DocumentService.getDocumentByTypeAndCommunity(communityId, selected);
      if (active) setDocuments(documents);
    }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "资料加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, category, typeId, revision]);
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return documents.filter((item) => [item.documentName, item.documentDescription].some((value) => value?.toLocaleLowerCase().includes(keyword)));
  }, [documents, query]);
  const canEdit = (document: Document) => access?.role === "owner" || access?.role === "admin" || access?.userId === document.documentAuthorId;
  async function remove(document: Document) {
    setBusy(true);
    try { await DocumentService.deleteDocument(document.documentId); message.success("文档已删除"); setRevision((value) => value + 1); }
    catch (error) { message.error(error instanceof Error ? error.message : "删除失败"); }
    finally { setBusy(false); }
  }
  return (
    <section>
      <h2>{management ? "文档管理" : category ? categoryLabel(category) : "社区资料"}</h2>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input aria-label="搜索资料" allowClear placeholder="搜索标题或摘要" value={query} onChange={(event) => setQuery(event.target.value)} style={{ width: 240 }} />
        {!category && <Select aria-label="资料分类" value={typeId} disabled={busy} onChange={setTypeId} style={{ width: 160 }}
          options={[{ value: "", label: "全部分类" }, ...categories.map((item) => ({ value: item.categoryId, label: categoryLabel(item.categoryName) }))]} />}
        <Button disabled={busy} onClick={() => setRevision((value) => value + 1)}>刷新</Button>
        {access?.membershipId && <Link href={`/community/${communityId}/documents/new`}>发布文档</Link>}
      </Space>
      {loading ? <Spin /> : error ? <Alert type="error" showIcon message={error} /> : management ? (
        <Table<Document> rowKey="documentId" dataSource={filtered} scroll={{ x: 650 }} columns={[
          { title: "标题", render: (_, document) => <Link href={`/community/${communityId}/document/${document.documentId}`}>{document.documentName}</Link> },
          { title: "分类", render: (_, document) => categoryLabel(categories.find((item) => item.categoryId === document.documentCategoryId)?.categoryName || "未分类") },
          { title: "摘要", dataIndex: "documentDescription", ellipsis: true },
          { title: "操作", render: (_, document) => canEdit(document) && <Space>
            <Link href={`/community/${communityId}/document/${document.documentId}/edit`}>编辑</Link>
            <Popconfirm title={`删除“${document.documentName}”？`} description="删除后无法恢复。" disabled={busy} onConfirm={() => remove(document)}><Button danger disabled={busy}>删除</Button></Popconfirm>
          </Space> },
        ]} />
      ) : filtered.length ? <CardGrid data={filtered.map((item) => ({ id: item.documentId, title: item.documentName,
        description: item.documentDescription, imageUrl: item.documentThumbnailUrl }))}
        handleCardClick={(id) => router.push(`/community/${communityId}/document/${id}`)} /> : <Empty description={query ? "没有匹配的资料" : "暂无资料，欢迎发布第一篇"} />}
    </section>
  );
}
