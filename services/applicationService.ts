import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type CreateApplicationInput = {
  postId: string;
  postOwnerId: string;
  applicantId: string;
  applicantEmail: string;
};

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected"
) {
  const applicationRef = doc(db, "applications", applicationId);

  await updateDoc(applicationRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getApplicationsByPostId(postId: string) {
  const q = query(
    collection(db, "applications"),
    where("postId", "==", postId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function getApplicationsByOwnerId(ownerId: string) {
  const q = query(
    collection(db, "applications"),
    where("postOwnerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}
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