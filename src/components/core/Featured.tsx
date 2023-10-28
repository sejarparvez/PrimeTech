"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../common/loading/Loading";

function Featured() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  interface Post {
    _id: string;
    coverImage: string;
    title: string;
    author: {
      name: string;
    };
    updatedAt: string;
    content: string;
  }

  // Function to properly encode a string for URLs
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str).replace(/%20/g, "_");
  };

  useEffect(() => {
    fetch(`api/featured`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "No featured posts found.") {
          setPost(null);
        } else {
          setPost(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    const day = formattedDate.split(" ")[0];
    const month = formattedDate.split(" ")[1];
    const year = formattedDate.split(" ")[2];
    return `${day}${daySuffix(day)} ${month} ${year}`;
  };

  const daySuffix = (day: string) => {
    if (+day >= 11 && +day <= 13) {
      return "th";
    }
    switch (+day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const plainTextContent = post?.content
    ? post.content.replace(/<[^>]+>/g, "")
    : "";
  const summary = plainTextContent.slice(0, 200);

  const encodedTitle = post?.title ? encodeForUrl(post.title) : "";

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center">
        No Featured Post To Display
      </div>
    );
  }

  return (
    <Link href={`/blog/featured/${encodedTitle}`}>
      <div className="flex flex-col gap-8 rounded-xl lg:rounded-3xl  p-2 border md:p-4 lg:p-6 lg:flex-row">
        <div className="flex-1 min-h-full  lg:order-2">
          <Image
            className="h-full w-full object-cover rounded"
            src={`${post.coverImage}`}
            alt=""
            width={500}
            height={500}
          />
        </div>
        <div className="relative flex flex-1 flex-col gap-5 lg:order-1">
          <div className="text-3xl font-bold md:text-4xl dark:text-lightgray-100 text-primary-200">
            {post.title}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {post.author?.name} || {formatDate(post?.updatedAt)}
          </div>
          <div className="text-dark-300 bottom-5 lg:bottom-0">{summary}...</div>
        </div>
      </div>
    </Link>
  );
}

export default Featured;
