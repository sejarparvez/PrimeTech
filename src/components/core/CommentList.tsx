// CommentsList.js
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Loading from "../common/loading/Loading";

interface Comment {
  id: string;
  author: {
    name: string;
    id: string;
    image: string | null;
  };
  createdAt: string;
  content: string;
}

interface CommentsListProps {
  postId: string;
  onCommentAdded: boolean;
}

function CommentsList({ postId, onCommentAdded }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(() => {
    setIsLoading(true);

    // Make an API request to fetch comments
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
    // Fetch comments when the component mounts
    fetchComments();
  }, [postId, onCommentAdded, fetchComments]); // Include onCommentAdded as a dependency

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-slate-100 p-4 rounded-lg dark:bg-black"
          >
            <div className="flex flex-row items-center gap-4">
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

              <div>
                <div className="flex flex-row items-baseline">
                  <span className="font-bold text-lg">
                    {comment.author.name}
                  </span>
                  <span className="ml-4 text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="mt-2 text-gray-700 dark:text-gray-300">
                  {comment.content}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsList;
