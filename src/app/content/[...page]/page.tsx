"use client";

import Loading from "@/components/common/loading/Loading";
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
  const params = useParams<{ page: string; item: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(params.page[1]);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchData = async () => {
        const response = await axios.get("/api/content?page=1&pageSize=10");
        console.log(response.data);
        setPosts(response.data.posts);
        setPostCount(response.data.totalPostsCount);
        setLoading(false);
      };

      fetchData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  console.log(posts);
  console.log(postCount);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div>Header</div>
      <div>
        <h1 className="text-center text-3xl font-extrabold underline decoration-primary md:text-4xl">
          Recent Post
        </h1>
        <div className="my-10 flex flex-col items-center gap-16">
          {loading ? (
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
        </div>
      </div>
      <div>Pagination</div>
    </div>
  );
}
