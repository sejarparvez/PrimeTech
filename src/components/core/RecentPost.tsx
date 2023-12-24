"use client";
import { useEffect, useState } from "react";
import Loading from "../common/loading/Loading";
import PaginationUi from "./Pagination";
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

      {totalPages > 1 && (
        <PaginationUi
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default RecentPost;
