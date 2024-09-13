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

export type ListElement = {
  type: "list";
  children: ListItemElement[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | ListElement
  | ListItemElement;

export type FormattedText = { text: string; bold?: true };
export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
  }
}
