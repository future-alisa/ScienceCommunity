"use client";
import styles from "@/app/my-community/channel/channel.module.css";
import { chatClient } from "@/components/chat-client";
import { ChatRoom } from "@/components/chat-room";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const initData = [
    {
      id: "132121",
      from: "string",
      to: "string",
      content: "nihao",
      comments: [],
    },
  ];
  const [data, setData] = useState(initData);

  const sendMessage = (message: string) => {
    chatClient.sendPublicMessage(message, groupId);
    setData([
      ...data,
      {
        id: Date.now().toString(),
        from: user.token,
        to: "string",
        content: message,
        comments: [],
      },
    ]);
  };

  const [receiver, setReceiver] = useState("");
  const user = useContext(UserContext);
  const [groupId, setGroupId] = useState("default-public-group");

  // 发送私聊消息
  const sendPrivate = () => {
    chatClient.sendPrivateMessage("", receiver);
  };

  // 加入群组
  const joinGroup = () => {
    chatClient.joinGroup(groupId);

    chatClient.onGroupMessage((message) => {
      console.log("receive group message:", message);
      setData((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: message.sender,
          to: groupId,
          content: message.content,
          comments: [],
        },
      ]);
    });
  };

  // 组件卸载时断开连接
  useEffect(() => {
    if (user.name) {
      // 连接服务器
      chatClient.connect(user.name, {
        onConnected: () => {
          console.log("connected");
          joinGroup();
        },
      });
    }
    return () => {
      chatClient.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <ChatRoom data={data} ownerId={user.token} sendMessage={sendMessage} />
    </div>
  );
}
