// src/services/ChatService.ts
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 定义消息类型
interface ChatMessage {
  type: "CHAT" | "JOIN" | "LEAVE" | "PRIVATE";
  content: string;
  sender: string;
  receiver?: string; // 用于私聊
  groupId?: string; // 用于群聊
}

// 定义连接选项接口
interface ConnectOptions {
  onConnected?: () => void;
  onGroupMessage?: (message: ChatMessage) => void;
}

class ChatClient {
  private client: Client;
  private subscriptions: StompSubscription[] = [];
  private username: string = "";
  private connected: boolean = false;
  private groupMessageHandlers: ((message: ChatMessage) => void)[] = [];

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:9092/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log("Connected: " + frame);
      this.subscribeToChannels();
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log("Disconnected");
    };
  }

  // 连接服务器并设置用户名
  public connect(username: string, options?: ConnectOptions): void {
    this.username = username;

    // 如果有传入的群组消息处理器，先保存
    if (options?.onGroupMessage) {
      this.groupMessageHandlers.push(options.onGroupMessage);
    }

    this.client.activate();

    // 覆盖onConnect以包含回调
    const originalOnConnect = this.client.onConnect;
    this.client.onConnect = (frame) => {
      originalOnConnect.call(this.client, frame);
      options?.onConnected?.();
    };
  }

  // 断开连接
  public disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.groupMessageHandlers = [];
    this.client.deactivate();
  }

  // 订阅所有需要的频道
  private subscribeToChannels(): void {
    // 订阅公共频道
    const publicSub = this.client.subscribe(
      "/topic/public",
      (message: Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.handlePublicMessage(chatMessage);
      }
    );
    this.subscriptions.push(publicSub);

    // 订阅私聊频道
    const privateSub = this.client.subscribe(
      `/user/queue/private`,
      (message: Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.handlePrivateMessage(chatMessage);
      }
    );
    this.subscriptions.push(privateSub);
  }

  // 添加群组消息处理器
  public onGroupMessage(handler: (message: ChatMessage) => void): void {
    this.groupMessageHandlers.push(handler);
  }

  // 发送公共消息
  public sendPublicMessage(content: string, groupId: string): void {
    if (!this.connected) return;

    const message: ChatMessage = {
      type: "CHAT",
      sender: this.username,
      content: content,
      groupId: groupId,
      receiver: "group",
    };

    this.client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  }

  // 发送私聊消息
  public sendPrivateMessage(content: string, receiver: string): void {
    if (!this.connected) return;

    const message: ChatMessage = {
      type: "PRIVATE",
      sender: this.username,
      receiver: receiver,
      content: content,
    };

    this.client.publish({
      destination: "/app/chat.private",
      body: JSON.stringify(message),
    });
  }

  // 加入群组
  public joinGroup(groupId: string): void {
    if (!this.connected) return;

    const message: ChatMessage = {
      type: "JOIN",
      sender: this.username,
      groupId: groupId,
      content: "",
    };

    this.client.publish({
      destination: "/app/group.join",
      body: JSON.stringify(message),
    });

    // 订阅群组频道
    const groupSub = this.client.subscribe(
      `/topic/group.${groupId}`,
      (message: Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.handleGroupMessage(chatMessage);
      }
    );
    this.subscriptions.push(groupSub);
  }

  // 消息处理器
  private handlePublicMessage(message: ChatMessage): void {
    console.log("[Public]", message.sender, ":", message.content);
    // 确保只处理真正的群组消息
    if (message.groupId) {
      this.groupMessageHandlers.forEach((handler) => handler(message));
    }
  }

  private handlePrivateMessage(message: ChatMessage): void {
    console.log("[Private]", message.sender, ":", message.content);
  }

  private handleGroupMessage(message: ChatMessage): void {
    console.log(
      `[Group ${message.groupId}]`,
      message.sender,
      ":",
      message.content
    );
    // 调用所有注册的群组消息处理器
    this.groupMessageHandlers.forEach((handler) => handler(message));
  }
}

export const chatClient = new ChatClient();
