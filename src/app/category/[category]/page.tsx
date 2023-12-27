"use client";
import Loading from "@/components/common/loading/Loading";
import CategorySection from "@/components/core/CategorySection";
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

  function formatString(inputString: string) {
    // Split the inputString by underscores
    const words = inputString.split("_");

    // Capitalize the first letter of each word and join them with a space
    const formattedString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedString;
  }

  const inputString = params.category;
  const formattedCategory = formatString(inputString);

  return (
    <div className="mt-10 flex flex-col justify-center md:flex-row md:gap-10">
      <div className="relative flex flex-col gap-10">
        <div>
          <div className=" flex md:mt-10">
            <span className="mx-auto  px-3 text-center text-2xl font-bold md:px-6 md:text-4xl ">
              {formattedCategory}
            </span>
          </div>
          <div className="mx-1 mt-20 flex flex-col items-center justify-center gap-16 md:mx-4">
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
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage > 1 ? prevPage - 1 : prevPage,
                )
              }
              disabled={currentPage === 1}
              className={`rounded-md px-4 py-2 ${
                currentPage === 1
                  ? "dark:bg-darkgray-200 dark:text-primary-100 cursor-not-allowed bg-gray-300 text-gray-600"
                  : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Prev
            </button>
            <div className="relative">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-darkgray-100 rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring"
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
                  prevPage < totalPages ? prevPage + 1 : prevPage,
                )
              }
              disabled={currentPage === totalPages}
              className={`rounded-md px-4 py-2 ${
                currentPage === totalPages
                  ? "dark:bg-darkgray-200 dark:text-primary-100 cursor-not-allowed bg-gray-300 text-gray-600"
                  : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <div className="mt-20 md:hidden">
        <CategorySection />
      </div>
    </div>
  );
}
