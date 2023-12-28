"use client";

import Header from "@/components/blog/Header";
import Loading from "@/components/common/loading/Loading";
import PaginationUi from "@/components/core/Pagination";
import RecentPostModel from "@/components/core/RecentPostModel";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Page() {
  const params = useParams<{ number: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(Number(params.number) || 1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/content?page=${page}&pageSize=10`,
        );
        console.log(response.data);
        setPosts(response.data.posts);
        setPostCount(response.data.totalPostsCount);
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <div><Header /></div>
      <div className="my-10 flex flex-col items-center gap-16">
        {loading && (
          <div className="w-full">
            <Loading />
          </div>
        )}
        {posts.map((post) => (
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
        ))}
        {!loading && posts.length > 0 && (
          <PaginationUi
            currentPage={page}
            totalPages={Math.ceil(Number(postCount) / 10)}
            setCurrentPage={(newPage) => setPage(newPage)}
          />
        )}
        {error && <div>Error: {error}</div>}
      </div>
    </div>
  );
}
