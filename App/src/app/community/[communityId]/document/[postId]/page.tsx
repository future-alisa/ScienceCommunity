"use client";
import { api } from "@/services/ApiService";
import { MyEditor } from "@/components/richtext-editor";
import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { DocumentRouteParams } from "@/model/MyRouteParams";
import { useParams } from "next/navigation";

export default function Page() {
  const { postId } = useParams<DocumentRouteParams>();
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "欢迎来到 SlateJS 世界！这是一个简单的示例文章。" }],
    },
  ]);
  const onChange = (value: Descendant[]) => {
    setValue(value);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(postId);
    const parseSlateJson = function (jsonString: string): Descendant[] {
      try {
        const parsed = JSON.parse(jsonString);
        // 验证是否是有效的 Slate 格式
        if (Array.isArray(parsed)) {
          return parsed as Descendant[];
        }
        throw new Error("Invalid Slate format");
      } catch (e) {
        console.error("Failed to parse Slate content:", e);
        // 返回一个默认的错误状态
        return [
          {
            type: "paragraph",
            children: [{ text: "内容解析失败" }],
          },
        ];
      }
    };

    const fethData = async () => {
      try {
        setIsLoading(true);
        const data = await api.get("/api/document/getById", {
          id: postId,
        });
        setValue(parseSlateJson(data.documentContent));
        console.log(data);
      } catch (error) {
        setValue([
          {
            type: "paragraph",
            children: [{ text: "加载失败" }],
          },
        ]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fethData();
  }, [postId]);

  return (
    <div>
      {isLoading ? (
        <div>加载文档中...</div>
      ) : (
        <MyEditor key={postId} initialValue={value} onChange={onChange} />
      )}
    </div>
  );
}
