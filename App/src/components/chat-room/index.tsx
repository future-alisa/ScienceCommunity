import styles from "./chat-room.module.css";
type ChatRoomProps = {
  name?: string;
  data: Message[];
};

type ChatListProps = {
  data: Message[];
};

type ChatMessageProps = {
  message: Message;
};

type Message = {
  id: string;
  from: string;
  to: string;
  content: string;
  comments: Message[];
};

const ChatList = ({ data }: ChatListProps) => {
  return (
    <div>
      {data.map((message, index) => {
        return <ChatMessage key={index} message={message} />;
      })}
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={styles.message_container}>
      <p>{message.content}</p>
      {message.comments.map((comment, index) => {
        return <p key={index}>{comment.content}</p>;
      })}
    </div>
  );
};

const ChatInput = ({ input, handleSubmit, handleInputChange }: any) => {
  return (
    <div className={styles.chat_input_container}>
      <textarea 
        className={styles.chat_input}
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <div className={styles.send_container}>
        <button
          className={styles.send_btn}
          type="submit"
          onClick={() => handleSubmit()}
        >
          发送
        </button>
      </div>
    </div>
  );
};

const ChatRoom = ({ data }: ChatRoomProps) => {
  return (
    <div>
      <ChatList data={data} />
      <ChatInput />
    </div>
  );
};

export { ChatRoom };
