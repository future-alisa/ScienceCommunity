import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

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

export type NumberdListElement = {
  type: "numbered-list";
  children: CustomText[];
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
  | ListElement
  | ListItemElement
  | BlockQuoteElement;

export type FormattedText = { text: string; bold?: true };
export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
  }
}
