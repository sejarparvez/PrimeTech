"use client";
import { useEffect, useState } from "react";
import Loading from "../common/loading/Loading";
import RecentPostModel from "./RecentPostModel";

interface Post {
  id: string;
  coverImage: string;
  title: string;
  content: string; // Added content property
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
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 3; // You can adjust this based on your needs

  useEffect(() => {
    setIsLoading(true);
    fetch(`api/allpost?page=${currentPage}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
      });
  }, [currentPage]);

  const totalPages = Math.ceil(posts.length / pageSize);
  const jumpToPageOptions = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-col items-center gap-16 my-10 m-1">
      {isLoading ? (
        <>
          <Loading />
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
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-darkgray-200 dark:text-primary-100"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            Prev
          </button>
          <div className="relative">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-4 py-2 rounded-md bg-darkgray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
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
                currentPage === index + 1
                  ? "bg-primary-200 dark:bg-primary-100 dark:text-primary-200 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-darkgray-200 dark:text-primary-100"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentPost;
