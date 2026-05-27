export type Post = {
  id: string;

  title: string;
  description: string;

  genre: string;

  roles: string[];

  tools: string;

  neededCount: string;

  deadline: string;

  status: "募集中" | "応募終了";

  thumbnailUrl: string;

  ownerId: string;
  ownerEmail: string;

  createdAt?: unknown;
  updatedAt?: unknown;

  closedAt?: unknown;
  deleteAt?: unknown;
  closeReason?: "deadline" | "manual";
};