import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../common/loading/Loading";

interface Comment {
  id: string;
  author: {
    name: string;
    id: string;
    image: string | null;
  };
  createdAt: string;
  likeCount: number;
  hasLiked: boolean;
  content: string;
}

interface CommentsListProps {
  postId: string;
  onCommentAdded: boolean;
}

function CommentsList({ postId, onCommentAdded }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user?.email;

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN;

  const fetchComments = useCallback(() => {
    setIsLoading(true);

    fetch(`/api/comment?${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, onCommentAdded, fetchComments]);

  const handleDelete = async (commentId: string) => {
    try {
      toast.loading("Please wait while we delete your comment.");
      const response = await fetch(`/api/comment?id=${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.dismiss();
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
      } else {
        toast.dismiss();
        toast.error("There was an error deleting your comment.");
      }
    } catch (error) {
      toast.error("There was an error deleting your comment.");
    }
  };

  // Function to handle liking/unliking a comment
  function handleIncrement(commentId: string) {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === commentId) {
          // Toggle like state and adjust likeCount
          const updatedComment = { ...comment };
          if (user && !updatedComment.hasLiked) {
            updatedComment.likeCount = updatedComment.likeCount + 1;
            updatedComment.hasLiked = true;
          } else if (user && updatedComment.hasLiked) {
            updatedComment.likeCount = updatedComment.likeCount - 1;
            updatedComment.hasLiked = false;
          }
          return updatedComment;
        }
        return comment;
      });
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col p-2 gap-3 bg-slate-100 dark:bg-gray-900 rounded-md"
          >
            <div className="flex  md:flex-row md:justify-between">
              <div className="flex flex-wrap md:flex-row gap-4 items-center">
                {comment.author.image ? (
                  <Image
                    src={comment.author.image}
                    alt=""
                    height={100}
                    width={100}
                    className="rounded-full h-12 w-12 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300  p-0.5 text-center text-sm">
                    No image
                  </div>
                )}
                <div className="font-bold text-xl">{comment.author.name}</div>
                <div>
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>
            <div className="md:ml-16">{comment.content}</div>
            <div className="md:pl-16 flex items-center justify-between mt-3">
              <div className="flex gap-2">
                {comment.likeCount > 0 && comment.likeCount}
                <div onClick={() => handleIncrement(comment.id)}>
                  {comment.hasLiked ? (
                    <LiaHeartSolid size={24} />
                  ) : (
                    <LiaHeart size={24} />
                  )}
                </div>
              </div>
              {(session?.user?.email === adminEmail ||
                session?.user?.name === comment.author.name) && (
                <button
                  className="bg-primary-200 px-3 h-8 rounded-md text-white dark:bg-primary-200 border"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </div>
  );
}

export default CommentsList;
