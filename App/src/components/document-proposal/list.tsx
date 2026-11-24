"use client";

import { Alert, List, Spin, Tag } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import DocumentProposalService, { ProposalSummary, proposalHref, proposalLabels } from "@/services/DocumentProposalService";
import { UserContext } from "@/context/UserContext";

export default function ProposalList({ documentId }: { documentId?: string }) {
  const user = useContext(UserContext);
  const [rows, setRows] = useState<ProposalSummary[]>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setRows(undefined);
    setError("");
    const request = documentId ? DocumentProposalService.list(documentId) : DocumentProposalService.mine();
    request.then((data) => { if (active) setRows(data); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "提案加载失败"); });
    return () => { active = false; };
  }, [documentId, user]);

  if (error) return <Alert type="error" message={error} showIcon />;
  if (!rows) return <Spin />;
  return <List dataSource={rows} locale={{ emptyText: "暂无修改提案" }} rowKey="id"
    renderItem={(row) => <List.Item>
      <List.Item.Meta title={<Link href={proposalHref(row.id)}>{row.summary || "未命名草稿"}</Link>}
        description={documentId ? undefined : row.documentName} />
      <Tag>{proposalLabels[row.status]}</Tag>
    </List.Item>} />;
}
