"use client";
import styles from "@/app/my-community/channel/channel.module.css";
import { ChatRoom } from "@/components/chat-room";

export default function Page() {
  const data = [
    {
      id: "121",
      from: "string",
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
  return (
    <div className={styles.container}>
      <ChatRoom data={data} />
    </div>
  );
}
