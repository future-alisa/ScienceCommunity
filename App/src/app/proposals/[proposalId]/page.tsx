"use client";

import { Alert, Button, Input, Popconfirm, Space, Spin, Tag, message } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import type { Descendant } from "slate";
import { DocumentWorkspace } from "@/components/document-editor/workspace";
import { MyEditor } from "@/components/richtext-editor";
import { UserContext } from "@/context/UserContext";
import DocumentProposalService, { ProposalDetail, proposalLabels } from "@/services/DocumentProposalService";
import { emptyDocument, parseDocument } from "@/util/DocumentContent";
import styles from "./proposal.module.css";

function comparisonRange(base: Descendant[], proposed: Descendant[]) {
  const oldBlocks = base.map((block) => JSON.stringify(block));
  const newBlocks = proposed.map((block) => JSON.stringify(block));
  let start = 0;
  while (start < oldBlocks.length && start < newBlocks.length && oldBlocks[start] === newBlocks[start]) start++;
  let oldEnd = oldBlocks.length;
  let newEnd = newBlocks.length;
  while (oldEnd > start && newEnd > start && oldBlocks[oldEnd - 1] === newBlocks[newEnd - 1]) {
    oldEnd--;
    newEnd--;
  }
  return { before: base.slice(start, oldEnd), after: proposed.slice(start, newEnd) };
}

export default function Page() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const user = useContext(UserContext);
  const [detail, setDetail] = useState<ProposalDetail>();
  const [base, setBase] = useState<Descendant[]>(emptyDocument);
  const [value, setValue] = useState<Descendant[]>(emptyDocument);
  const [summary, setSummary] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [busy, setBusy] = useState(false);
  const [fullComparison, setFullComparison] = useState(false);
  const range = useMemo(() => detail?.canEdit ? undefined : comparisonRange(base, value), [base, detail?.canEdit, value]);

  useEffect(() => {
    let active = true;
    setDetail(undefined);
    setError("");
    setNote("");
    setSourceError("");
    setFullComparison(false);
    DocumentProposalService.detail(proposalId).then((data) => {
      if (!active) return;
      setBase(parseDocument(data.baseContent));
      setValue(parseDocument(data.proposedContent));
      setSummary(data.proposal.summary);
      setDetail(data);
    }).catch((reason) => {
      if (active) setError(reason instanceof Error ? reason.message : "提案加载失败");
    });
    return () => { active = false; };
  }, [proposalId, user]);

  async function save(submit: boolean) {
    if (!detail || busy || sourceError) return;
    setBusy(true);
    try {
      const content = JSON.stringify(parseDocument(JSON.stringify(value)));
      const next = await DocumentProposalService.save(proposalId, { revision: detail.proposal.revision, content, summary, submit });
      setDetail(next);
      setSummary(next.proposal.summary);
      message.success(submit ? "已提交审阅" : "草稿已保存");
    } catch (reason) { message.error(reason instanceof Error ? reason.message : "提案保存失败"); }
    finally { setBusy(false); }
  }

  async function review(action: "merge" | "return" | "close") {
    if (!detail || busy) return;
    setBusy(true);
    try {
      const next = await DocumentProposalService.review(proposalId, { revision: detail.proposal.revision, action, note });
      setDetail(next);
      setNote("");
      message.success(proposalLabels[next.proposal.status]);
    } catch (reason) { message.error(reason instanceof Error ? reason.message : "审阅操作失败"); }
    finally { setBusy(false); }
  }

  if (error) return <Alert type="error" showIcon message={error} />;
  if (!detail) return <Spin />;
  const row = detail.proposal;
  const before = fullComparison ? base : range?.before ?? base;
  const after = fullComparison ? value : range?.after ?? value;
  const originalUrl = `/community/${row.communityId}/document/${row.documentId}`;
  return <section className={styles.page}>
    <Space wrap><Link href={originalUrl}>返回原文</Link><Link href={`${originalUrl}/proposals`}>全部提案</Link></Space>
    <h1>{row.documentName} · 修改提案</h1>
    <Tag>{proposalLabels[row.status]}</Tag>
    {row.reviewNote && <Alert showIcon message="审阅意见" description={row.reviewNote} />}
    {detail.outdated && (detail.canEdit || row.status === "submitted") && <Alert showIcon type="warning"
      message="原文版本已更新"
      description="可继续保存此草稿。提交或合并前，请从最新原文创建新副本并迁移修改。" />}
    {detail.canEdit ? <>
      <label htmlFor="proposal-summary">修改说明</label>
      <Input.TextArea id="proposal-summary" value={summary} onChange={(event) => setSummary(event.target.value)}
        maxLength={255} showCount disabled={busy} placeholder="说明改了什么，以及参考来源" />
      <DocumentWorkspace key={proposalId} communityId={row.communityId} documentId={row.documentId}
        value={value} onChange={setValue} onError={setSourceError} disabled={busy} />
      <Space wrap>
        <Button onClick={() => save(false)} loading={busy} disabled={!!sourceError}>保存草稿</Button>
        <Button type="primary" onClick={() => save(true)} loading={busy}
          disabled={!!sourceError || !summary.trim() || detail.outdated}>提交审阅</Button>
      </Space>
    </> : <>
      {row.summary && <p>{row.summary}</p>}
      <Button className={styles.comparisonToggle} onClick={() => setFullComparison((current) => !current)}>
        {fullComparison ? "查看改动范围" : "对照完整正文"}
      </Button>
      <div className={styles.comparison}>
        <section aria-label="原文版本"><h2>修改前</h2>{before.length
          ? <MyEditor key={`${proposalId}-base-${fullComparison}`} initialValue={before} readOnly />
          : <p>此处为新增内容</p>}</section>
        <section aria-label="提案版本"><h2>修改后</h2>{after.length
          ? <MyEditor key={`${proposalId}-proposed-${fullComparison}`} initialValue={after} readOnly />
          : <p>此处内容已删除</p>}</section>
      </div>
      {detail.canReview && <>
        <label htmlFor="proposal-review-note">审阅意见</label>
        <Input.TextArea id="proposal-review-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} showCount disabled={busy} />
        <Space wrap>
          <Popconfirm title="确认将提案正文合并到公开原文？" onConfirm={() => review("merge")} disabled={busy || detail.outdated}>
            <Button type="primary" loading={busy} disabled={detail.outdated}>合并修改</Button>
          </Popconfirm>
          <Button onClick={() => review("return")} disabled={busy || !note.trim()}>退回修改</Button>
          <Popconfirm title="关闭这条修改提案？" onConfirm={() => review("close")} disabled={busy}>
            <Button disabled={busy}>关闭提案</Button>
          </Popconfirm>
        </Space>
      </>}
    </>}
  </section>;
}
