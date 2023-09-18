"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";

export default function TestPage() {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const user = session?.user?.email;

  function handleIncrement() {
    if (user && !hasLiked) {
      setLikeCount(likeCount + 1);
      setHasLiked(true);
    } else if (user && hasLiked) {
      setLikeCount(likeCount - 1);
      setHasLiked(false);
    } else if (!user) {
      alert("Please login first");
    }
  }

  console.log(session?.user?.email);
  return (
    <div className="bg-slate-100 flex items-center justify-center h-60 w-80 mx-auto rounded-lg shadow-xl flex-col gap-10">
      <div className="text-2xl font-bold">Like Count: {likeCount}</div>
      <div className="flex items-center gap-10 text-xl">
        <div onClick={handleIncrement}>
          {hasLiked ? (
            <div>
              <LiaHeartSolid />
            </div>
          ) : (
            <LiaHeart />
          )}
        </div>
      </div>
    </div>
  );
}
