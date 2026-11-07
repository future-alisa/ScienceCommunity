"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import Link from "next/link";
import DocumentService from "@/services/DocumentService";
import { Document } from "@/model/Document";
import { parseDocument } from "@/util/DocumentContent";
import { MyEditor } from "./index";
export const EmbedPathContext = createContext<string[]>([]);
export function DocumentEmbed({ documentId, name }: { documentId: string; name: string }) {
  const path = useContext(EmbedPathContext);
  const pathKey = path.join("/");
  const blocked = path.includes(documentId) || path.length >= 3;
  const [document, setDocument] = useState<Document>();
  const [error, setError] = useState("");
  useEffect(() => {
    if (blocked) return;
    let active = true; setDocument(undefined); setError("");
    DocumentService.getDocumentById(documentId).then((value) => { parseDocument(value.documentContent); if (active) setDocument(value); })
      .catch(() => { if (active) setError("文档已删除或当前账号无权阅读"); });
    return () => { active = false; };
  }, [documentId, pathKey, blocked]);
  return <div className="document-embed">
    <div className="document-embed-heading">↗ {document?.documentName || name}</div>
    {blocked ? <p>已停止循环或过深的文档引用。</p> : error ? <p>{error}</p> : !document ? <Spin size="small" /> : <>
      <Link href={`/community/${document.documentCommunityId}/document/${document.documentId}`}>打开原文档</Link>
      <EmbedPathContext.Provider value={[...path, documentId]}><MyEditor initialValue={parseDocument(document.documentContent)} readOnly /></EmbedPathContext.Provider>
    </>}
  </div>;
}
