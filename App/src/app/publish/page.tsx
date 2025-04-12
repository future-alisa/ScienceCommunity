"use client";
import { MyEditor } from "@/components/richtext-editor";
import { Button, Flex, Radio } from "antd";

export default function Page() {
  return (
    <Flex
      vertical
      style={{
        overflow: "auto",
        padding: "8px",
      }}
    >
      <MyEditor />
      <Flex justify="center">
        <Radio.Group
          value={1}
          options={[
            { value: 1, label: "基础知识" },
            { value: 2, label: "案例" },
            { value: 3, label: "推文" },
          ]}
        />
        <Button type="primary">发布</Button>
      </Flex>
    </Flex>
  );
}
