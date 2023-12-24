"use client";
import Featured from "@/components/core/Featured";
import HotPost from "@/components/core/HotPost";
import RecentPost from "@/components/core/RecentPost";

export default function Home() {
  return (
    <main>
      <div className="flex w-full flex-col gap-16">
        <Featured />
        <HotPost />
        <RecentPost />
      </div>
    </main>
  );
}
