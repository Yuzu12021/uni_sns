import { Post } from "../types/post";

export function isDeadlinePassed(deadline: string) {
  if (!deadline) return false;

  const deadlineDate = new Date(`${deadline}T00:00:00`);

  return new Date() >= deadlineDate;
}

export function isPostClosed(
  post: Pick<Post, "status" | "deadline">
) {
  return (
    post.status === "応募終了" ||
    isDeadlinePassed(post.deadline)
  );
}