import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
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
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
  await setDoc(
    chatRef,
    {
      ownerId,
      memberIds: arrayUnion(ownerId, applicantId),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return;
}

  await setDoc(chatRef, {
    postId,
    postTitle,
    ownerId,
    memberIds: [ownerId, applicantId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}