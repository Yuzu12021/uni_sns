import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { Post } from "../types/post";
import { where } from "firebase/firestore";

export async function getPostsByOwner(ownerId: string) {
  const q = query(
    collection(db, "posts"),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Post[];
}

export async function closePost(id: string, closeReason: "manual" | "deadline") {
  const postRef = doc(db, "posts", id);

  const now = new Date();
  const deleteDate = new Date(now);
  deleteDate.setDate(deleteDate.getDate() + 7);

  await updateDoc(postRef, {
    status: "応募終了",
    closedAt: Timestamp.fromDate(now),
    deleteAt: Timestamp.fromDate(deleteDate),
    closeReason,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string) {
  const postRef = doc(db, "posts", id);

  await deleteDoc(postRef);
}

export async function getPosts() {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Post[];
}

export async function getPostById(id: string) {
  const postRef = doc(db, "posts", id);

  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    return null;
  }

  return {
    id: postSnap.id,
    ...postSnap.data(),
  } as Post;
}

type CreatePostInput = {
  title: string;
  description: string;
  genre: string;
  roles: string[];
  tools: string;
  neededCount: string;
  deadline: string;
  ownerId: string;
  ownerEmail: string;
};

export async function createPost(data: CreatePostInput) {
  await addDoc(collection(db, "posts"), {
    ...data,

    status: "募集中",

    thumbnailUrl: "",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}