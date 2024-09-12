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
      {data.map((message) => {
        return <ChatMessage key={message.id} message={message} />;
      })}
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div>
      <p>{message.content}</p>
      {message.comments.map((comment) => {
        return <p>{comment.content}</p>;
      })}
    </div>
  );
};

const ChatInput = ({ input, handleSubmit, handleInputChange }: any) => {
  return (
    <div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">发送</button>
      </form>
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
