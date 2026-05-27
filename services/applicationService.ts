import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type CreateApplicationInput = {
  postId: string;
  postOwnerId: string;
  applicantId: string;
  applicantEmail: string;
};

export async function hasAlreadyApplied(postId: string, applicantId: string) {
  const q = query(
    collection(db, "applications"),
    where("postId", "==", postId),
    where("applicantId", "==", applicantId)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
}

export async function createApplication(data: CreateApplicationInput) {
  await addDoc(collection(db, "applications"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}