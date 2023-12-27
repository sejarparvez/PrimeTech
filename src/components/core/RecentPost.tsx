"use client";
import Link from "next/link";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`api/allpost?page=1&pageSize=10`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);

        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-center text-3xl font-extrabold underline decoration-primary md:text-4xl">
        Recent Post
      </h1>
      <div className="my-10 flex flex-col items-center gap-16">
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
      </div>
      <Link href="/blog" className="mt-12 flex items-center justify-center">
        <Button className="md:h-12  md:px-20  " size="lg">
          View All Post
        </Button>
      </Link>
    </div>
  );
}

export default RecentPost;
