import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type UpsertChatRoomInput = {
  postId: string;
  postTitle: string;
  ownerId: string;
  applicantId: string;
};

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
        memberIds: arrayUnion(applicantId),
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