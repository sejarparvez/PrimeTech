"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../ui/button";
import CommentsList from "./CommentList";

interface CommentFormProps {
  postId: string;
}

function CommentForm({ postId }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [added, setAdded] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!comment) {
      // Handle case where comment is empty
      return;
    }

    const payload = {
      content: comment,
      postId,
    };

    try {
      toast.loading("Please wait while we save your comment to the database.");
      const response = await fetch(`/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.dismiss();
        toast.success("Your comment has been submitted.");
        setAdded(true);
        // Handle success, reset the comment field
        setComment("");
      } else {
        // Handle error response
        toast.dismiss();
        toast.error("There was an error submitting your comment.");
        const responseData = await response.json();
        // You can show the error message from responseData
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error sending comment:", error);
      // Show a generic error message to the user
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden ">
      <div className="flex flex-col gap-4  rounded-lg border dark:border-darkgray-200 p-4">
        <span className="text-2xl font-semibold">Leave A Reply</span>
        {name ? (
          <div className="flex flex-col gap-6">
            <span className="items-baseline">
              <span className="pr-2 text-xl">
                You Are Logged In As{" "}
                <Link href={"/dashboard"}>
                  <span className="font-bold text-primary">{name}</span>{" "}
                </Link>
              </span>
            </span>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="mb-2 block font-bold text-gray-700 dark:text-gray-300"
                  htmlFor="comment"
                >
                  Comment
                </label>
                <textarea
                  className="focus:shadow-outline h-32 w-full appearance-none rounded border py-2 px-3 leading-tight  focus:outline-none dark:bg-slate-800 md:h-40"
                  id="comment"
                  placeholder="Enter your comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <Button size="lg" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-xl">
            You Need To{" "}
            <Link href={"/login"}>
              <span className="font-bold text-primary">Log In</span>
            </Link>
          </div>
        )}
      </div>
      <CommentsList postId={postId} onCommentAdded={added} />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default CommentForm;
