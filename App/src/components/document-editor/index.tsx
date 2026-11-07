"use client";
import { Alert, Button, Form, Input, Select, Space, Spin, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { Descendant, Node } from "slate";
import { useRouter } from "next/navigation";
import { categoryLabel } from "@/components/document-library";
import DocumentService from "@/services/DocumentService";
import CommunityService from "@/services/CommunityService";
import MemberService from "@/services/MemberService";
import { Document } from "@/model/Document";
import { Category } from "@/model/Category";
import { Community } from "@/model/Community";
import { emptyDocument, parseDocument } from "@/util/DocumentContent";
import { DocumentWorkspace } from "./workspace";
import CoverPicker from "@/components/cover-picker";

export function DocumentEditor({ communityId, documentId }: { communityId?: string; documentId?: string }) {
  const router = useRouter();
  const [form] = Form.useForm<{ title: string; description: string; categoryId: string; communityId: string; cover: string }>();
  const [coverUploading, setCoverUploading] = useState(false);
  const coverBusy = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [original, setOriginal] = useState<Document>();
  const [value, setValue] = useState<Descendant[]>(emptyDocument);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [contentError, setContentError] = useState("");
  const selectedCommunityId = Form.useWatch("communityId", form);
  const savingRef = useRef(false);
  const contentText = value.map((node) => Node.string(node)).join("\n");
  useEffect(() => {
    if (!dirty) return;
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const navigate = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
      if (link && link.href !== window.location.href && !window.confirm("文档尚未保存，确定离开吗？")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", leave);
    window.document.addEventListener("click", navigate, true);
    return () => { window.removeEventListener("beforeunload", leave); window.document.removeEventListener("click", navigate, true); };
  }, [dirty]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); if (!loading && !error && !savingRef.current) form.submit(); }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [form, loading, error]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    Promise.all([DocumentService.getCategories(), CommunityService.getCommunitiesByUser(), documentId ? DocumentService.getDocumentById(documentId) : Promise.resolve(undefined)])
      .then(async ([categories, communities, document]) => {
        if (!active) return;
        categories = categories.filter((item) => ["base", "case", "post"].includes(item.categoryName));
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
        setDirty(false);
        form.setFieldsValue({ title: document?.documentName || "", description: document?.documentDescription || "",
          categoryId: document?.documentCategoryId || categories[0].categoryId, communityId: target, cover: document?.documentThumbnailUrl || "" });
      }).catch((error) => { if (active) setError(error instanceof Error ? error.message : "编辑器加载失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [communityId, documentId, form, revision]);
  async function save(fields: { title: string; description: string; categoryId: string; communityId: string; cover: string }) {
    if (savingRef.current) return;
    if (coverBusy.current) { message.warning("请等待封面上传完成"); return; }
    if (contentError) { message.warning(contentError); return; }
    if (!value.some((node) => Node.string(node).trim() || ("type" in node && ["image", "attachment", "document-reference"].includes(node.type)))) { message.warning("请输入文档正文或插入资料"); return; }
    setSaving(true);
    savingRef.current = true;
    try {
      const saved = await DocumentService.upsertDocument({
        documentId: original?.documentId || "", documentName: fields.title.trim(), documentDescription: fields.description?.trim() || "",
        documentCategoryId: fields.categoryId, documentCommunityId: original?.documentCommunityId || fields.communityId,
        documentContent: JSON.stringify(parseDocument(JSON.stringify(value))), documentAuthorId: original?.documentAuthorId || "",
        documentThumbnailUrl: fields.cover || "",
        documentCreateDate: original?.documentCreateDate || new Date(), documentUpdateDate: new Date(),
      });
      message.success(original ? "文档已保存" : "文档已发布");
      setOriginal(saved);
      setDirty(false);
      router.push(`/community/${saved.documentCommunityId}/document/${saved.documentId}`);
      router.refresh();
    } catch (error) { message.error(error instanceof Error ? error.message : "保存失败，请重试"); }
    finally { setSaving(false); savingRef.current = false; }
  }
  if (loading) return <Spin />;
  if (error) return <Alert type="error" showIcon message={error} action={<Button onClick={() => setRevision((value) => value + 1)}>重试</Button>} />;
  return (
    <section style={{ maxWidth: 1000, width: "100%", margin: "0 auto", padding: 24 }}>
      <h1>{original ? "编辑文档" : "发布文档"}</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>理论资料、案例与文章共用同一套文档格式，通过分类组织内容。</p>
      <Form form={form} layout="vertical" onFinish={save} disabled={saving} onValuesChange={() => setDirty(true)}>
        <Form.Item name="title" label="标题" rules={[{ required: true, whitespace: true, message: "请输入标题" }, { max: 100 }]}><Input maxLength={100} /></Form.Item>
        <Space wrap align="start">
          <Form.Item name="communityId" label="目标社区" rules={[{ required: true, message: "请选择社区" }]}>
            <Select aria-label="目标社区" style={{ width: 240 }} disabled={saving || coverUploading || !!original || !!communityId} onChange={() => { form.setFieldValue("cover", ""); }} options={communities.map((item) => ({ value: item.communityId, label: item.communityName }))} />
          </Form.Item>
          <Form.Item name="categoryId" label="资料分类" rules={[{ required: true, message: "请选择分类" }]}>
            <Select aria-label="资料分类" style={{ width: 200 }} options={categories.map((item) => ({ value: item.categoryId, label: categoryLabel(item.categoryName) }))} />
          </Form.Item>
        </Space>
        <Form.Item name="description" label="摘要" rules={[{ max: 255 }]}><Input.TextArea rows={3} maxLength={255} showCount /></Form.Item>
        <Form.Item name="cover" label="资料封面" extra="可选，上传后点击发布或保存修改。移除封面会恢复默认展示。">
          <CoverPicker key={selectedCommunityId} communityId={original?.documentCommunityId || selectedCommunityId} disabled={saving} onBusyChange={busy => { coverBusy.current = busy; setCoverUploading(busy); }} />
        </Form.Item>
        <Form.Item label="正文" required>
          <Space style={{ marginBottom: 12 }} wrap>
            <Button onClick={() => setPreview((value) => !value)}>{preview ? "继续编辑" : "预览正文"}</Button>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{contentText.replace(/\s/g, "").length} 字 · {dirty ? "有未保存的修改" : "暂无未保存的修改"} · Ctrl / ⌘ S 保存</span>
          </Space>
          <DocumentWorkspace key={`${documentId || "new"}-${revision}`} value={value} onChange={(value) => { setValue(value); setDirty(true); }}
            onError={(error) => { setContentError(error); if (error) setDirty(true); }} communityId={original?.documentCommunityId || selectedCommunityId} documentId={original?.documentId} disabled={saving} preview={preview} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} disabled={coverUploading}>{original ? "保存修改" : "发布"}</Button>
      </Form>
    </section>
  );
}
