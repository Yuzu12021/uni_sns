"use client";
import AuthGuard from "../components/AuthGuard";
import HeroSection from "../components/HeroSection";
import PostList from "../components/PostList";
import SearchFilterSection from "../components/SearchFilterSection";
import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
const [selectedRole, setSelectedRole] = useState("");
const [sortType, setSortType] = useState("new");
  return (
    <AuthGuard>
      <main className="bg-white text-slate-950">
        <HeroSection />

        <div className="mx-auto mt-[10vh] max-w-7xl px-6">
          <SearchFilterSection
  keyword={keyword}
  setKeyword={setKeyword}
  selectedRole={selectedRole}
  setSelectedRole={setSelectedRole}
  sortType={sortType}
  setSortType={setSortType}
/>
          <PostList
  keyword={keyword}
  selectedRole={selectedRole}
  sortType={sortType}
/>
        </div>
      </main>
    </AuthGuard>
  );
}