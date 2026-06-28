import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChatRoom } from "../types/chat";

type UpsertChatRoomInput = {
  postId: string;
  postTitle: string;
  ownerId: string;
  applicantId: string;
};

export function subscribeChatRoom(
  chatId: string,
  callback: (chatRoom: any) => void
) {
  const chatRef = doc(db, "chats", chatId);

  return onSnapshot(chatRef, (snapshot) => {
    if (!snapshot.exists()) return;

    callback({
      id: snapshot.id,
      ...snapshot.data(),
    });
  });
}

export async function markChatAsRead(chatId: string, uid: string) {
  await setDoc(
    doc(db, "chats", chatId),
    {
      lastReadAtByUser: {
        [uid]: serverTimestamp(),
      },
    },
    { merge: true }
  );
}

export async function sendChatMessage({
  chatId,
  senderId,
  senderName,
  senderIconUrl,
  text,
}: {
  chatId: string;
  senderId: string;
  senderName: string;
  senderIconUrl: string;
  text: string;
}) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    chatId,
    senderId,
    senderName,
    senderIconUrl,
    text,
    createdAt: serverTimestamp(),
  });

  await setDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribeChatMessages(
  chatId: string,
  callback: (messages: any[]) => void
) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    callback(messages);
  });
}

export async function getChatRoomsByMemberId(uid: string) {
  const q = query(
    collection(db, "chats"),
    where("memberIds", "array-contains", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as ChatRoom[];
}

export async function upsertProjectChatRoom({
  postId,
  postTitle,
  ownerId,
  applicantId,
}: UpsertChatRoomInput) {
  const chatRef = doc(db, "chats", postId);

  await setDoc(
    chatRef,
    {
      postId,
      postTitle,
      ownerId,
      memberIds: arrayUnion(ownerId, applicantId),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}