import { useEffect, useRef, useState } from "react";
import styles from "./chat-room.module.css";
import { useTheme } from "@/theme/ThemeContext";
import { chatClient } from "../chat-client";
type ChatRoomProps = {
  name?: string;
  ownerId: string;
  data: Message[];
  sendMessage: (message: string) => void;
};

type ChatListProps = {
  data: Message[];
  ownerId: string;
};

type ChatMessageProps = {
  message: Message;
  send: boolean;
};

type Message = {
  id: string;
  from: string;
  to: string;
  content: string;
  comments: Message[];
};

const ChatList = ({ data, ownerId }: ChatListProps) => {
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className={styles.chat_list} ref={chatListRef}>
      {data.map((message, index) => {
        const send = message.from === ownerId;
        return <ChatMessage key={index} message={message} send={send} />;
      })}
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, send }) => {
  return (
    <div
      className={`${styles.message_container} ${
        send ? styles.my_message : styles.other_message
      }`}
    >
      <p>{message.content}</p>
      {message.comments.map((comment, index) => {
        return <p key={index}>{comment.content}</p>;
      })}
    </div>
  );
};

const ChatInput = ({ handleSubmit }: any) => {
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  return (
    <div className={styles.chat_input_container}>
      <textarea
        className={styles.chat_input}
        style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
        value={message}
        onChange={(value) => setMessage(value.target.value)}
        placeholder="Type a message..."
      />
      <div className={styles.send_container}>
        <button
          className={styles.send_btn}
          type="submit"
          onClick={() => {
            handleSubmit(message);
            setMessage("");
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
};

const ChatRoom = ({ data, ownerId, sendMessage }: ChatRoomProps) => {
  return (
    <div className={styles.chat_room}>
      <ChatList data={data} ownerId={ownerId} />
      <ChatInput handleSubmit={sendMessage} />
    </div>
  );
};

export { ChatRoom };
