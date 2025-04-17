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
  onChannelMessage?: (message: ChatMessage) => void;
}

class ChatClient {
  private client: Client;
  private subscriptions: StompSubscription[] = [];
  private username: string = "";
  private connected: boolean = false;
  private groupMessageHandlers: ((message: ChatMessage) => void)[] = [];
  private channelMessageHandlers: ((message: ChatMessage) => void)[] = [];

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:9092/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log("Disconnected");
    };
  }
  // 加入频道
  joinChannel(channelId = "11") {
    const message: ChatMessage = {
      type: "CHAT",
      sender: this.username,
      content: "Join channel",
      groupId: "groupId",
      receiver: "group",
    };
    this.client.publish({
      destination: `/app/channel/${channelId}/join`,
      body: JSON.stringify(message),
    });

    // 订阅频道消息（使用用户专属队列避免接收自己发送的消息）
    this.client.subscribe(`/user/queue/channel/${channelId}`, (message) => {
      const msg = JSON.parse(message.body);
      console.log(msg);
    });

    // 订阅频道通知（可选）
    this.client.subscribe(
      `/topic/channel/${channelId}/notifications`,
      (notification) => {
        console.log(notification.body);
      }
    );

    this.subscribeToChannel("11");
  }
  private channelSubscriptions: Map<string, StompSubscription> = new Map();

  // 订阅特定频道
  private subscribeToChannel(channelId: string) {
    if (this.channelSubscriptions.has(channelId)) {
      return; // 已订阅则不再重复订阅
    }

    const sub = this.client.subscribe(
      `/topic/channel/${channelId}`,
      (message) => {
        const msg: ChatMessage = JSON.parse(message.body);
        // this.handleGroupMessage(msg);
        console.log("receive channel message:", msg);
      }
    );

    // 或用户专属订阅方式（推荐）
    const privateSub = this.client.subscribe(
      `/user/queue/channel/${channelId}`,
      (message) => {
        const msg: ChatMessage = JSON.parse(message.body);
        this.handleChannelMessage(msg);
      }
    );

    this.channelSubscriptions.set(channelId, privateSub);
    // this.subscriptions.push(sub);
    this.subscriptions.push(privateSub);
  }

  // 取消订阅特定频道
  private unsubscribeFromChannel(channelId: string) {
    const sub = this.channelSubscriptions.get(channelId);
    if (sub) {
      sub.unsubscribe();
      this.channelSubscriptions.delete(channelId);
    }
  }

  // 离开频道
  leaveChannel(channelId = "11") {
    const message: ChatMessage = {
      type: "CHAT",
      sender: this.username,
      content: "Join channel",
      groupId: "groupId",
      receiver: "group",
    };
    this.client.publish({
      destination: `/app/channel/${channelId}/leave`,
      body: JSON.stringify(message),
    });
    this.unsubscribeFromChannel(channelId);
  }

  // 发送消息到频道
  public sendChannelMessage(content: string, channelId = "11") {
    const message: ChatMessage = {
      type: "CHAT",
      sender: this.username,
      content: content,
      groupId: "groupId",
      receiver: "group",
    };
    this.client.publish({
      destination: `/app/channel/${channelId}/send`,
      body: JSON.stringify(message),
    });
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
      this.sendJoinMessage();
      this.joinChannel();
      options?.onConnected?.();
    };

    if (options?.onGroupMessage) {
      this.groupMessageHandlers.push(options.onGroupMessage);
    }

    if (options?.onChannelMessage) {
      this.channelMessageHandlers.push(options.onChannelMessage);
    }

    this.client.activate();
  }

  // 断开连接
  public async disconnect(): Promise<void> {
    if (this.client.connected) {
      this.sendLeaveMessage();
    }

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.groupMessageHandlers = [];

    await this.client.deactivate();
    console.log("✅ 已调用 deactivate，等待断开完成");
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

  sendJoinMessage() {
    const message: ChatMessage = {
      type: "JOIN",
      content: `${this.username} joined`,
      sender: this.username,
    };
    this.client.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify(message),
    });
  }

  sendLeaveMessage() {
    const message: ChatMessage = {
      type: "LEAVE",
      content: `${this.username} leaved`,
      sender: this.username,
    };
    this.client.publish({
      destination: "/app/chat.removeUser",
      body: JSON.stringify(message),
    });
  }
  // 消息处理器
  private handlePublicMessage(message: ChatMessage): void {
    console.log("[Public]", message.sender, ":", message.content);
    // 确保只处理真正的群组消息
    if (message.groupId) {
      this.handleGroupMessage(message);
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
      message.content,
      this.groupMessageHandlers.length
    );
    // 调用所有注册的群组消息处理器
    this.groupMessageHandlers.forEach((handler) => handler(message));
  }

  handleChannelMessage(msg: ChatMessage) {
    console.log("receive private channel message:", msg);
    this.groupMessageHandlers.forEach((handler) => handler(msg));
  }
}

export const chatClient = new ChatClient();
