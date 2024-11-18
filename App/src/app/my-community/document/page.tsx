"use client";
import styles from "@/app/my-community/document/post.module.css";
import { MyEditor } from "@/components/richtext-editor";
import { Button } from "antd";

export default function Page() {
  return (
    <div>
      <Button type="primary">发布</Button>
      <MyEditor />
    </div>
  );
}
