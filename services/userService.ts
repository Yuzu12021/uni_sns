import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile } from "../types/user";

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserProfile;
}

export async function saveUserProfile(profile: UserProfile) {
  await setDoc(doc(db, "users", profile.uid), {
    ...profile,
    updatedAt: new Date(),
  });
}