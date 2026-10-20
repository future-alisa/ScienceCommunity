"use client";
import { Alert, Button, Form, Input, Select, Space, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { Descendant, Node } from "slate";
import { useRouter } from "next/navigation";
import { MyEditor } from "@/components/richtext-editor";
import { categoryLabel } from "@/components/document-library";
import DocumentService from "@/services/DocumentService";
import CommunityService from "@/services/CommunityService";
import MemberService from "@/services/MemberService";
import { Document } from "@/model/Document";
import { Category } from "@/model/Category";
import { Community } from "@/model/Community";
import { emptyDocument, parseDocument } from "@/util/DocumentContent";

export function DocumentEditor({ communityId, documentId }: { communityId?: string; documentId?: string }) {
  const router = useRouter();
  const [form] = Form.useForm<{ title: string; description: string; categoryId: string; communityId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [original, setOriginal] = useState<Document>();
  const [value, setValue] = useState<Descendant[]>(emptyDocument);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    Promise.all([DocumentService.getCategories(), CommunityService.getCommunitiesByUser(), documentId ? DocumentService.getDocumentById(documentId) : Promise.resolve(undefined)])
      .then(async ([categories, communities, document]) => {
        if (!active) return;
        if (!categories.length) throw new Error("暂无资料分类，请联系管理员配置");
        if (!communities.length) throw new Error("请先加入社区后发布文档");
        if (document && document.documentCommunityId !== communityId) throw new Error("文档不属于当前社区");
        const target = document?.documentCommunityId || communityId || communities[0].communityId;
        if (!communities.some((item) => item.communityId === target)) throw new Error("你尚未加入目标社区");
        if (document) {
          const access = await MemberService.access(target);
          if (access.userId !== document.documentAuthorId && access.role !== "owner" && access.role !== "admin") throw new Error("只有作者或社区管理员可以编辑文档");
        }
        const content = document ? parseDocument(document.documentContent) : emptyDocument;
        if (!active) return;
        setCategories(categories); setCommunities(communities); setOriginal(document); setValue(content);
        form.setFieldsValue({ title: document?.documentName || "", description: document?.documentDescription || "",
          categoryId: document?.documentCategoryId || categories[0].categoryId, communityId: target });
      }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "编辑器加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, documentId, form, revision]);
  async function save(fields: { title: string; description: string; categoryId: string; communityId: string }) {
    if (saving) return;
    if (!value.some((node) => Node.string(node).trim())) { message.warning("请输入文档正文"); return; }
    setSaving(true);
    try {
      const saved = await DocumentService.upsertDocument({
        documentId: original?.documentId || "", documentName: fields.title.trim(), documentDescription: fields.description?.trim() || "",
        documentCategoryId: fields.categoryId, documentCommunityId: original?.documentCommunityId || fields.communityId,
        documentContent: JSON.stringify(value), documentAuthorId: original?.documentAuthorId || "",
        documentThumbnailUrl: original?.documentThumbnailUrl || "",
        documentCreateDate: original?.documentCreateDate || new Date(), documentUpdateDate: new Date(),
      });
      message.success(original ? "文档已保存" : "文档已发布");
      router.push(`/community/${saved.documentCommunityId}/document/${saved.documentId}`);
      router.refresh();
    } catch (error) { message.error(error instanceof Error ? error.message : "保存失败，请重试"); }
    finally { setSaving(false); }
  }
  if (loading) return <Spin />;
  if (error) return <Alert type="error" showIcon message={error} action={<Button onClick={() => setRevision((value) => value + 1)}>重试</Button>} />;
  return (
    <section style={{ maxWidth: 1000, width: "100%", margin: "0 auto", padding: 24 }}>
      <h1>{original ? "编辑文档" : "发布文档"}</h1>
      <Form form={form} layout="vertical" onFinish={save} disabled={saving}>
        <Form.Item name="title" label="标题" rules={[{ required: true, whitespace: true, message: "请输入标题" }, { max: 100 }]}><Input maxLength={100} /></Form.Item>
        <Space wrap align="start">
          <Form.Item name="communityId" label="目标社区" rules={[{ required: true, message: "请选择社区" }]}>
            <Select aria-label="目标社区" style={{ width: 240 }} disabled={saving || !!original || !!communityId} options={communities.map((item) => ({ value: item.communityId, label: item.communityName }))} />
          </Form.Item>
          <Form.Item name="categoryId" label="资料分类" rules={[{ required: true, message: "请选择分类" }]}>
            <Select aria-label="资料分类" style={{ width: 200 }} options={categories.map((item) => ({ value: item.categoryId, label: categoryLabel(item.categoryName) }))} />
          </Form.Item>
        </Space>
        <Form.Item name="description" label="摘要" rules={[{ max: 255 }]}><Input.TextArea rows={3} maxLength={255} showCount /></Form.Item>
        <Form.Item label="正文" required>
          <MyEditor key={`${documentId || "new"}-${revision}`} initialValue={value} onChange={setValue} readOnly={saving} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>{original ? "保存修改" : "发布"}</Button>
      </Form>
    </section>
  );
}
