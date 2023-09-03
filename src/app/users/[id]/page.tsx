"use client";
import Loading from "@/components/common/loading/Loading";
import RecentPostModel from "@/components/core/RecentPostModel";
import Image from "next/image";
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

function Post({ params }: { params: { id: string } }) {
  const postsPerPage = 10;
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    id: "",
    posts: [],
    image: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const apiUrl = `/api/user?id=${params.id}&page=${currentPage}&limit=${postsPerPage}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        return response.json();
      })
      .then((postInfo) => {
        setUserInfo(postInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id, currentPage]);

  const name = userInfo?.name;
  const email = userInfo?.email;
  const id = userInfo?.id;
  const posts = userInfo?.posts || [];
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="flex flex-col md:gap-10 mt-10">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6  w-full  bg-slate-100 dark:bg-gray-900">
          <div className="flex items-center justify-center col-span-3 md:col-span-1 h-full w-full">
            <Image
              src={userInfo.image}
              alt=""
              height={500}
              width={500}
              className=" object-cover h-60 w-80"
            />
          </div>
          <div className="flex flex-col items-center text-center mx-auto w-full col-span-3 md:col-span-1 justify-center gap-6 px-4 md:px-0">
            <div className="text-4xl font-bold uppercase mx-auto">{name}</div>
            <div className="text-xl">{email}</div>
          </div>
        </div>
        <div>
          <div className=" flex md:mt-10">
            <span className="mx-auto px-3 text-center text-2xl font-bold md:px-6 md:text-4xl ">
              <span> Every Article Published By </span>

              <span className="text-3xl font-extrabold md:text-5xl text-pink">
                {name}
              </span>
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

export default Post;
