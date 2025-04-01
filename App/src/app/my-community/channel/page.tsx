"use client";
import styles from "@/app/my-community/channel/channel.module.css";
import { ChatRoom } from "@/components/chat-room";
import { useState } from "react";

export default function Page() {
  const initData = [
    {
      id: "121",
      from: "213213123",
      to: "string",
      content: "nihao",
      comments: [
        {
          id: "13321",
          from: "string",
          to: "string",
          content: "nihao",
          comments: [],
        },
      ],
    },
    {
      id: "12221",
      from: "string",
      to: "string",
      content: "nihao",
      comments: [],
    },
    {
      id: "132121",
      from: "string",
      to: "string",
      content: "nihao",
      comments: [],
    },
  ];
  const [data, setData] = useState(initData);
  const ownerId = "213213123";

  const sendMessage = (message: string) => {
    setData([
      ...data,
      {
        id: "121",
        from: ownerId,
        to: "string",
        content: message,
        comments: [],
      },
    ]);
  };

  return (
    <div className={styles.container}>
      <ChatRoom data={data} ownerId={ownerId} sendMessage={sendMessage} />
    </div>
  );
}
