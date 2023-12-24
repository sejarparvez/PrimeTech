import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../common/loading/Loading";
import { Button } from "../ui/button";

interface Comment {
  hasLiked: any;
  likeCount: number;
  id: string;
  author: {
    name: string;
    id: string;
    image: string | null;
  };
  createdAt: string;
  likedBy: string[];
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
  const user = session?.user?.id as string | undefined;

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
          (comment) => comment.id !== commentId,
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

  // Function to handle liking/disliking a comment
  async function handleIncrement(commentId: string, comment: Comment) {
    if (user) {
      try {
        toast.loading("Please wait while we update your like status.");

        // Construct the URL and parameters properly using URLSearchParams
        const params = new URLSearchParams();
        params.append("commentId", commentId);
        if (user) {
          params.append("userId", user ?? "");
        }

        if (!comment.likedBy.includes(user)) {
          params.append("like", "true");
        } else {
          params.append("like", "false");
        }

        // Send a PUT request to your API to update the like status
        const response = await fetch(`/api/comment?${params.toString()}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const responseData = await response.json(); // Parse the response data
          const updatedComments = comments.map((c) => {
            if (c.id === comment.id) {
              // Update the likedBy array and likeCount based on the response data
              return {
                ...c,
                likedBy: responseData.likedBy,
                likeCount: responseData.likeCount,
              };
            }
            return c;
          });

          setComments(updatedComments);
          toast.dismiss();
          toast.success("Updated like status");
        } else {
          toast.dismiss();
          toast.error("There was an error updating your like status.");
        }
      } catch (error) {
        toast.error("There was an error updating your like status.");
      }
    } else {
      toast.error("You must be logged in to like comments.");
    }
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
            className="flex flex-col gap-3 rounded-md bg-slate-100 p-2 dark:bg-gray-900"
          >
            <div className="flex  md:flex-row md:justify-between">
              <div className="flex flex-wrap items-center gap-4 md:flex-row">
                {comment.author.image ? (
                  <Image
                    src={comment.author.image}
                    alt=""
                    height={100}
                    width={100}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300  p-0.5 text-center text-sm">
                    No image
                  </div>
                )}
                <div className="text-xl font-bold">{comment.author.name}</div>
                <div>
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>
            <div className="md:ml-16">{comment.content}</div>
            <div className="mt-3 flex items-center justify-between md:pl-16">
              <div className="flex gap-2">
                {comment.likedBy.length > 0 && comment.likedBy.length}
                <div onClick={() => handleIncrement(comment.id, comment)}>
                  {user && comment.likedBy.includes(user) ? (
                    <LiaHeartSolid size={24} />
                  ) : (
                    <LiaHeart size={24} />
                  )}
                </div>
              </div>
              {(session?.user?.email === adminEmail ||
                session?.user?.name === comment.author.name) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </Button>
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
