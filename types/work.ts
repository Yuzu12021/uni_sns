
import type { Timestamp } from "firebase/firestore";

export type Work = {
  id: string;

  // 作品の基本情報
  title: string;
  description: string;

  // 制作に関する情報
  roles: string[];
  tools: string[];

  // 作品紹介ページなど（任意）
  workUrl: string;

  // 投稿者
  ownerId: string;
  ownerEmail: string;

  // 投稿日時（FirestoreのTimestamp型）
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
