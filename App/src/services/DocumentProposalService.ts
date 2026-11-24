import { api } from "./ApiService";

export type ProposalStatus = "draft" | "submitted" | "returned" | "merged" | "closed";

export interface ProposalSummary {
  id: string;
  documentId: string;
  documentName: string;
  communityId: string;
  proposerId: string;
  status: ProposalStatus;
  revision: number;
  summary: string;
  reviewNote: string;
  reviewerId: string | null;
}

export interface ProposalDetail {
  proposal: ProposalSummary;
  baseContent: string;
  proposedContent: string;
  canEdit: boolean;
  canReview: boolean;
  outdated: boolean;
}

export interface ContributionSettings {
  license: string | null;
  canManage: boolean;
  canPropose: boolean;
}

const documentPath = (id: string) => `/document-proposal/document/${encodeURIComponent(id)}`;
const proposalPath = (id: string) => `/document-proposal/${encodeURIComponent(id)}`;

export const proposalHref = (id: string) => `/proposals/${encodeURIComponent(id)}`;
export const proposalLabels: Record<ProposalStatus, string> = {
  draft: "草稿", submitted: "待审阅", returned: "需修改", merged: "已合并", closed: "已关闭",
};

const DocumentProposalService = {
  settings: (id: string) => api.get<ContributionSettings>(`${documentPath(id)}/settings`),
  setLicense: (id: string, license: string) => api.put<ContributionSettings>(`${documentPath(id)}/settings`, { license }),
  list: (id: string) => api.get<ProposalSummary[]>(documentPath(id)),
  mine: () => api.get<ProposalSummary[]>("/document-proposal/mine"),
  fork: (id: string) => api.post<string>(documentPath(id)),
  detail: (id: string) => api.get<ProposalDetail>(proposalPath(id)),
  save: (id: string, body: { revision: number; content: string; summary: string; submit: boolean }) =>
    api.put<ProposalDetail>(proposalPath(id), body),
  review: (id: string, body: { revision: number; action: "merge" | "return" | "close"; note: string }) =>
    api.post<ProposalDetail>(`${proposalPath(id)}/review`, body),
};

export default DocumentProposalService;
