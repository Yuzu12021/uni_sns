export type Application = {
  id: string;

  postId: string;
  postOwnerId: string;

  applicantId: string;
  applicantEmail: string;

  status: "pending" | "accepted" | "rejected";

  createdAt?: unknown;
};