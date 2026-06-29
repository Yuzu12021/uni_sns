export type UserProfile = {
  uid: string;
  email: string;

  name: string;
  nickname: string;

  grade: string;
  seminar: string;
  shortBio: string;

  roles: string[];
  otherRole: string;

  tools: string;
  bio: string;

  iconUrl: string;

  portfolioUrls: string[];

  updatedAt?: unknown;
};