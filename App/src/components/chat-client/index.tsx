import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type MessageType =
  | "JOIN"
  | "LEAVE"
  | "CHANNEL"
  | "PRIVATE"
  | "PUBLIC"
  | "CREATE";

interface ChatMessage {
  type: MessageType;
  from: string;
  to: string;
  content: string;
}

function MessageFactory(
  type: MessageType,
  from: string,
  to: string,
  content: string
): ChatMessage {
  return {
    type: type,
    from: from,
    to: to,
    content: content,
  };
}

interface ConnectOptions {
  onConnected?: () => void;
  onPublicMessage?: (message: ChatMessage) => void;
  onPrivateMessage?: (message: ChatMessage) => void;
  onChannelMessage?: (message: ChatMessage) => void;
}

class ChatClient {
  private client: Client;
  private username: string = "";
  private connected: boolean = false;

  // 消息订阅
  private subscriptions: StompSubscription[] = [];
  private channelSubscriptions: Map<string, StompSubscription[]> = new Map();

  // 消息处理
  private channelMessageHandlers: Set<(message: ChatMessage) => void> =
    new Set();
  private publicMessageHandlers: Set<(message: ChatMessage) => void> =
    new Set();
  private privateMessageHandlers: Set<(message: ChatMessage) => void> =
    new Set();

  constructor() {
    console.log("聊天服务器地址：", process.env.NEXT_PUBLIC_CHAT_URL);
    this.client = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_CHAT_URL!),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };
  }

  // 连接服务器
  public connect(username: string, options?: ConnectOptions): void {
    this.username = username;
    this.client.connectHeaders = {
      username: this.username,
    };

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log("Connected: " + frame.headers["user-name"]);
      this.setupDefaultSubscriptions();
      options?.onConnected?.();
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log("Disconnected");
    };

    if (options?.onChannelMessage) {
      this.channelMessageHandlers.add(options.onChannelMessage);
    }
    if (options?.onPrivateMessage) {
      this.privateMessageHandlers.add(options.onPrivateMessage);
    }
    if (options?.onPublicMessage) {
      this.publicMessageHandlers.add(options.onPublicMessage);
    }

    this.client.activate();
  }

  // 断开连接
  public async disconnect(): Promise<void> {
    this.channelMessageHandlers.clear();
    this.privateMessageHandlers.clear();
    this.publicMessageHandlers.clear();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    await this.client.deactivate();
    console.log("已调用 deactivate，等待断开完成");
  }

  // 发送公共消息
  public sendPublicMessage(content: string): void {
    if (!this.connected) return;

    const message: ChatMessage = MessageFactory(
      "PUBLIC",
      this.username,
      "",
      content
    );

    this.sendMessage("/app/chat.sendMessage", message);
  }

  // 发送私聊消息
  public sendPrivateMessage(content: string, receiver: string): void {
    if (!this.connected) return;

    const message: ChatMessage = MessageFactory(
      "PRIVATE",
      this.username,
      receiver,
      content
    );

    this.sendMessage("/app/chat.private", message);
  }

  // 发送消息到频道
  public sendChannelMessage(content: string, channelId: string) {
    const message: ChatMessage = MessageFactory(
      "CHANNEL",
      this.username,
      channelId,
      content
    );
    this.sendMessage(`/app/channel/${channelId}/send`, message);
  }

  // 加入频道
  public joinChannel(channelId: string) {
    const message: ChatMessage = MessageFactory(
      "JOIN",
      this.username,
      channelId,
      "Join channel"
    );

    this.subscribeToChannel(channelId);
    // 发送加入频道消息
    this.sendMessage(`/app/channel/${channelId}/join`, message);
  }

  // 设置默认订阅
  private setupDefaultSubscriptions(): void {
    // 订阅公共消息
    this.subscribe("/topic/public");
    // 订阅私聊队列
    this.subscribe(`/user/queue/private`);

    console.log("set default subs");
  }

  // 订阅特定频道
  private subscribeToChannel(channelId: string) {
    // 已订阅则不再重复订阅
    if (this.channelSubscriptions.has(channelId)) {
      return;
    }

    // 频道公共消息订阅
    const pubsub = this.subscribe(`/topic/channel/${channelId}`);
    // 用户专属订阅方式
    const prisub = this.subscribe(`/user/queue/channel/${channelId}`);
    // 订阅频道通知
    const notisub = this.subscribe(`/topic/channel/${channelId}/notifications`);

    this.channelSubscriptions.set(channelId, [pubsub, prisub, notisub]);
  }

  // 取消订阅特定频道
  private unsubscribeFromChannel(channelId: string) {
    const subs = this.channelSubscriptions.get(channelId);
    if (subs) {
      subs.forEach((val) => val.unsubscribe());
      this.channelSubscriptions.delete(channelId);
    }
  }

  // 封装订阅功能
  private subscribe(destination: string) {
    const sub = this.client.subscribe(
      destination,
      this.handleReceiveMessage.bind(this)
    );
    this.subscriptions.push(sub);
    return sub;
  }

  private handleReceiveMessage(message: IMessage) {
    const msg: ChatMessage = JSON.parse(message.body);
    console.info(`receive [${msg.type}] ${msg.from}: ${msg.content}`);
    switch (msg.type) {
      case "CHANNEL":
        this.handleChannelMessage(msg);
        break;
      case "JOIN":
      case "LEAVE":
      case "CREATE":
        break;
      case "PRIVATE":
        this.handlePrivateMessage(msg);
        break;
      case "PUBLIC":
        this.handlePublicMessage(msg);
        break;
      default:
        break;
    }
  }

  private handleChannelMessage(msg: ChatMessage) {
    this.channelMessageHandlers.forEach((handler) => handler(msg));
  }

  private handlePublicMessage(message: ChatMessage): void {
    this.publicMessageHandlers.forEach((handler) => handler(message));
  }

  private handlePrivateMessage(message: ChatMessage): void {
    this.privateMessageHandlers.forEach((handler) => handler(message));
  }

  // 封装发消息的功能
  private sendMessage(destination: string, msg: ChatMessage) {
    this.client.publish({
      destination: destination,
      body: JSON.stringify(msg),
    });
    console.info(` send [${msg.type}] ${msg.from} : ${msg.content}`);
  }

  // 离开频道
  private leaveChannel(channelId: string) {
    const message: ChatMessage = MessageFactory(
      "LEAVE",
      this.username,
      "",
      "Leave channel"
    );

    this.client.publish({
      destination: `/app/channel/${channelId}/leave`,
      body: JSON.stringify(message),
    });

    this.unsubscribeFromChannel(channelId);
  }

  private sendJoinMessage() {
    const message: ChatMessage = MessageFactory(
      "JOIN",
      this.username,
      "",
      `${this.username} joined`
    );

    this.client.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify(message),
    });
  }

  private sendLeaveMessage() {
    const message: ChatMessage = MessageFactory(
      "LEAVE",
      this.username,
      "",
      `${this.username} leaved`
    );
    this.client.publish({
      destination: "/app/chat.removeUser",
      body: JSON.stringify(message),
    });
  }
}

export const chatClient = new ChatClient();
