
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
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { Work } from "../types/work";

// 新しい作品を投稿するためのデータ
type CreateWorkInput = {
  title: string;
  description: string;
  roles: string[];
  tools: string[];
  workUrl: string;
  ownerId: string;
  ownerEmail: string;
};

// 作品を新規作成
export async function createWork(data: CreateWorkInput) {
  const docRef = await addDoc(collection(db, "works"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// 作品一覧を新しい順に取得
export async function getWorks(): Promise<Work[]> {
  const q = query(
    collection(db, "works"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  })) as Work[];
}

// IDから作品を1件取得
export async function getWorkById(
  id: string
): Promise<Work | null> {
  const workRef = doc(db, "works", id);
  const snapshot = await getDoc(workRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Work;
}

// 特定の学生が投稿した作品を取得
export async function getWorksByOwner(
  ownerId: string
): Promise<Work[]> {
  const q = query(
    collection(db, "works"),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  })) as Work[];
}

// 作品を編集するときのデータ
type UpdateWorkInput = {
  title: string;
  description: string;
  roles: string[];
  tools: string[];
  workUrl: string;
};

// 作品を更新
export async function updateWork(
  id: string,
  data: UpdateWorkInput
) {
  const workRef = doc(db, "works", id);

  await updateDoc(workRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// 作品を削除
export async function deleteWork(id: string) {
  const workRef = doc(db, "works", id);
  await deleteDoc(workRef);
}
