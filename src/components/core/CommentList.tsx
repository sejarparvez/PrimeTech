import { useEffect, useState } from "react";

interface Comment {
  id: string;
  author: {
    name: string;
  };
  createdAt: string;
  content: string;
}

function CommentsList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Make an API request to fetch comments
    fetch(`/api/comment?${postId}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg dark:bg-black">
          <div className="flex flex-row items-center gap-4">
            <div className="bg-gray-300 rounded-full h-12 w-12"></div>
            <div>
              <div className="flex flex-row items-baseline">
                <span className="font-bold text-lg">{comment.author.name}</span>
                <span className="ml-4 text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 text-gray-700 dark:text-gray-300">
                {comment.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
