import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | BlockQuoteElement
  | { type: "code-block"; language?: string; children: CustomText[] }
  | { type: "image"; url: string; name: string; children: CustomText[] }
  | { type: "attachment"; url: string; name: string; children: CustomText[] }
  | { type: "document-reference"; documentId: string; name: string; children: CustomText[] };

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  url?: string;
};
export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement & { align?: "left" | "center" | "right" | "justify" };
    Text: CustomText;
  }
}
