"use client";
import { useEffect, useState } from "react";
import Loading from "../common/loading/Loading";
import { Button } from "../ui/button";
import RecentPostModel from "./RecentPostModel";

interface Post {
  id: string;
  coverImage: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  category: string;
}

function RecentPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setIsLoading(true);
    fetch(`api/allpost?page=${currentPage}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(Math.ceil(data.totalPostsCount / pageSize));
        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
      });
  }, [currentPage]);

  const jumpToPageOptions = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-col items-center gap-16 my-10">
      {isLoading ? (
        <>
          <div className="w-full">
            <Loading />
          </div>
        </>
      ) : (
        posts.map((post) => {
          return (
            <RecentPostModel
              cover={post.coverImage}
              title={post.title}
              summary={post.content}
              category={post.category}
              author={post.author}
              createdAt={post.updatedAt}
              key={post.id}
              _id={post.id}
            />
          );
        })
      )}
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-4 items-center">
          <Button
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "" : "bg-primary text-white cursor-pointer"
            }`}
          >
            Prev
          </Button>
          <div className="relative">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none"
            >
              {jumpToPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1 ? "bg-primary" : " border"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <Button
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-primary text-primary-foreground cursor-not-allowed dark:bg-darkgray-200 dark:text-primary-100"
                : "bg-primary text-white cursor-pointer"
            }`}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default RecentPost;
