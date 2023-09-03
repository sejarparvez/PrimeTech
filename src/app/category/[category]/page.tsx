"use client";
import Loading from "@/components/common/loading/Loading";
import RecentPostModel from "@/components/core/RecentPostModel";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  coverImage: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
  };
  createdAt: string;
};

export default function Post({ params }: { params: { category: string } }) {
  const postsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const apiUrl = `/api/categorypost?category=${params.category}&page=${currentPage}&limit=${postsPerPage}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((postInfo) => {
        setPosts(postInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.category, currentPage]);

  // Calculate total pages based on the total number of posts and posts per page
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="flex flex-col md:gap-10 mt-10">
      <div className="flex flex-col gap-10">
        <div>
          <div className=" flex md:mt-10">
            <span className="mx-auto uppercase px-3 text-center text-2xl font-bold md:px-6 md:text-4xl ">
              {params.category}
            </span>
          </div>
          <div className="flex items-center justify-center gap-16 flex-col mt-20 mx-1 md:mx-4">
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : posts.length === 0 ? (
              <p>No posts available.</p>
            ) : (
              posts.map((post: Post) => (
                <RecentPostModel
                  cover={post.coverImage}
                  title={post.title}
                  summary={post.content}
                  category={post.category}
                  author={post.author}
                  createdAt={post.createdAt}
                  key={post.id}
                  _id={post.id}
                />
              ))
            )}
          </div>
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex gap-4 items-center">
            <button
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage > 1 ? prevPage - 1 : prevPage
                )
              }
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
                {Array.from({ length: totalPages }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage < totalPages ? prevPage + 1 : prevPage
                )
              }
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
    </div>
  );
}
