"use client";
import { useEffect, useState } from "react";

import Loading from "../common/loading/Loading";
import HotPostModel from "./HotPostModel";

interface Post {
  id: string;
  coverImage: string;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  title: string;
}

export default function HotPost() {
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`api/hotpost`)
      .then((response) => response.json())
      .then((data) => {
        setHotPosts(data);

        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
        setErrorMessage("Error loading posts");
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
    if (day >= "11" && day <= "13") {
      return "th";
    }
    switch (day.slice(-1)) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";
      default:
        return "th";
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center">{errorMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {hotPosts.map((post) => (
        <HotPostModel
          key={post.id}
          cover={post.coverImage}
          author={post.author.name}
          time={formatDate(post.updatedAt)}
          heading={post.title}
          id={post.id}
        />
      ))}
    </div>
  );
}
