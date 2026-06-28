export type ChatRoom = {
  id: string;
  postId: string;
  postTitle: string;
  ownerId: string;
  memberIds: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderIconUrl: string;
  text: string;
  createdAt?: unknown;
};