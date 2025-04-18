"use client";
import styles from "@/app/my-community/channel/channel.module.css";
import { chatClient } from "@/components/chat-client";
import { ChatRoom, Message } from "@/components/chat-room";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<Message[]>([]);
  const [channelId, setChannelId] = useState("11");
  const user = useContext(UserContext);

  const joinChannel = (channelId: string) => {
    chatClient.joinChannel(channelId);
  };

  const sendMessage = (message: string) => {
    chatClient.sendChannelMessage(message, channelId);
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

  const disconnect = async () => {
    await chatClient.disconnect();
  };

  useEffect(() => {
    const handleConnected = () => {
      joinChannel(channelId);
    };
    const handleReceiveChannelMessage = (message: any) => {
      console.log("receive channel message:", message);
      setData((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: message.sender,
          to: message.to,
          content: message.content,
          comments: [],
        },
      ]);
    };
    const connect = () => {
      if (user.name) {
        chatClient.connect(user.name, {
          onConnected: handleConnected,
          onChannelMessage: handleReceiveChannelMessage,
        });
      }
    };

    connect();

    return () => {
      disconnect();
    };
  }, [channelId, user.name]);

  return (
    <div className={styles.container}>
      <ChatRoom data={data} ownerId={user.token} sendMessage={sendMessage} />
    </div>
  );
}
