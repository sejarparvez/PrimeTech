"use client";

import AuthorCard from "@/components/card/AuthorCard";
import Loading from "@/components/common/loading/Loading";
import CommentForm from "@/components/core/Comment";
import Sidebar from "@/components/layout/SideBar";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./PostContent.module.css";

interface PageProps {
  params: { slug: string; category: string };
}

interface Post {
  id: string;
  content: string;
  title: string;
  author: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  createdAt: string;
  category: string;
  coverImage: string;
}

export default function Post({ params }: PageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = `/api/${params.category}/${params.slug}`;

    setError(null);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((postInfo: Post) => {
        setPost(postInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching the post.");
        setIsLoading(false);
      });
  }, [params.category, params.slug]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleDelete = async (): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmed) {
      setIsDeleting(true);

      try {
        const response = await fetch(
          `/api/${post.category}/${params.slug}?${post.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          router.push("/");
        } else {
          console.error("Error deleting post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string): string => {
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

  const daySuffix = (day: string): string => {
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
  function stripHtmlTags(html: string) {
    return html.replace(/(<([^>]+)>)/gi, "");
  }

  const cleanedContent = stripHtmlTags(post.content);

  const userInfo = session?.user?.email;
  const dynamicDescription = cleanedContent.substring(0, 150);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content="Your concise post description here."
        />
        {/* Open Graph tags for Facebook */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={dynamicDescription} />
        <meta property="og:image" content={post.coverImage} />
        <meta
          property="og:url"
          content={`${process.env.SITE_URL}/${params.category}/${params.slug}`}
        />
        <meta property="og:type" content="article" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="md:sticky z-20 top-14 md:left-3 md:h-screen mt-6 mx-auto md:mt-0">
          <Sidebar />
        </div>
        <div className="flex w-full relative">
          <div className="flex flex-col md:gap-4 mx-1 md:mx-4">
            <div className="rounded-2xl py-1">
              <div className="mb-10 rounded-lg  py-4 px-2 md:px-4">
                <h1 className="mb-4 text-3xl md:text-4xl text-primary-200 dark:text-lightgray-100 font-extrabold">
                  {post.title}
                </h1>
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div>
                    <span className="flex text-sm">
                      <span className="text-sm ">
                        This Post Last Was Updated By{" "}
                        <Link href={`/users/${post.author.id}`}>
                          <span className="px-1 text-lg font-medium ">
                            {post.author.name}
                          </span>{" "}
                        </Link>
                        At{" "}
                        <span className=" font-medium">
                          {formatDate(post.createdAt)}
                        </span>
                      </span>
                    </span>
                  </div>
                  <div>
                    <Link href={`/category/${post.category}`}>
                      {" "}
                      <button className="mr-10 rounded-tl-2xl rounded-br-2xl bg-primary-200 px-4 py-1 font-bold text-white dark:text-primary-200 dark:bg-primary-100">
                        {post.category}
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-6 md:flex-row">
                  {userInfo === post.author.email && (
                    <div className="mx-auto flex items-center justify-center md:justify-end">
                      <div>
                        <Link
                          className="mr-4 flex gap-1 rounded-lg bg-black px-3 py-2 font-bold text-white hover:bg-primary-200 dark:border"
                          href={`/editpost/${params.category}/${params.slug}`}
                        >
                          Edit Post
                        </Link>
                      </div>
                      <div>
                        <button
                          className=" flex gap-1 rounded-lg bg-red-600 px-3 py-2 font-bold text-white hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Image
                className="mx-auto rounded-lg w-full object-cover h-60 md:h-96"
                src={`${post.coverImage}`}
                alt=""
                width={1000}
                height={1000}
              />
              <div
                className={`mt-10 mb-12 rounded-lg md:mx-0 md:mt-16 md:text-lg ${styles["post-content"]}`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            <div className="my-20">
              <CommentForm postId={post.id} />
            </div>
            <div className="w-full lg:hidden  -right-10 rounded-lg  md:top-14 md:h-[86%] border dark:border-bdr-200">
              <div className="flex flex-col justify-between h-[70%]">
                <div className=" h-[76%] rounded-2xl ">
                  <AuthorCard
                    id={post.author.id}
                    name={post.author.name}
                    image={post.author.image}
                  />
                </div>
                <div className=" rounded-xl  h-80 flex items-center justify-center">
                  Advertise
                </div>
              </div>
            </div>
          </div>
          <div className="w-full hidden h-[20rem] lg:h-[35rem] lg:block right-2 rounded-lg lg:sticky md:top-14 mb-6 border dark:border-bdr-200">
            <div className="flex flex-col justify-between h-[70%]">
              <div className=" h-[76%] rounded-2xl ">
                <AuthorCard
                  id={post.author.id}
                  name={post.author.name}
                  image={post.author.image}
                />
              </div>
              <div className=" rounded-xl  h-80 flex items-center justify-center">
                Advertise
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
