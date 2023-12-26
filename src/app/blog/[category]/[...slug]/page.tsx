"use client";

import AuthorCard from "@/components/card/AuthorCard";
import { AlertDialogDemo } from "@/components/common/alert/Alert";
import Loading from "@/components/common/loading/Loading";
import CommentForm from "@/components/core/Comment";
import { Button } from "@/components/ui/button";
import { Blur } from "@/image/Blur";
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
  updatedAt: string;
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

  function formatString(inputString: string) {
    // Split the inputString by underscores
    const words = inputString.split("_");

    // Capitalize the first letter of each word and join them with a space
    const formattedString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedString;
  }

  const inputString = post.category;
  const formattedCategory = formatString(inputString);

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
      <div>
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="relative flex w-full">
            <div className="flex flex-col lg:mx-4 lg:gap-4">
              <div className="rounded-2xl py-1">
                <div className="rounded-lg md:mb-10  md:py-4 ">
                  <h1 className="mb-4 text-xl font-extrabold text-primary md:text-2xl lg:text-3xl">
                    {post.title}
                  </h1>
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <span className="flex text-sm">
                        <span className="text-sm ">
                          This Post Last Was Updated By{" "}
                          <Link href={`/users/${post.author.id}`}>
                            <span className="px-1 text-lg font-medium text-primary">
                              {post.author.name}
                            </span>{" "}
                          </Link>
                          At{" "}
                          <span className=" font-medium">
                            {formatDate(post.updatedAt)}
                          </span>
                        </span>
                      </span>
                    </div>
                    <div>
                      <Link href={`/category/${post.category}`}>
                        {" "}
                        <button className="dark:text-primary-200 mr-10 rounded-br-2xl rounded-tl-2xl bg-primary px-4 py-1 font-bold text-white">
                          {formattedCategory}
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-6 md:flex-row">
                    {userInfo === post.author.email && (
                      <div className="mx-auto flex items-center justify-center gap-4 md:justify-end">
                        <div>
                          <Link
                            href={`/editpost/${params.category}/${params.slug}`}
                          >
                            <Button size="lg">Edit Post</Button>
                          </Link>
                        </div>
                        <div>
                          <AlertDialogDemo
                            link={`/api/${post.category}/${params.slug}?${post.id}`}
                            onDelete={() => router.push("/")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Image
                  className="mx-auto h-60 w-full rounded-lg object-cover md:h-96"
                  src={`${post.coverImage}`}
                  alt=""
                  width={1000}
                  height={1000}
                  placeholder="blur"
                  blurDataURL={Blur}
                />
                <div
                  className={`mb-12 mt-4 rounded-lg md:mt-16 md:text-lg ${styles["post-content"]}`}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              <div className="my-20">
                <CommentForm postId={post.id} />
              </div>
              <div className="dark:border-bdr-200 -right-10 w-full rounded-lg  border md:top-14 md:h-[86%] lg:hidden">
                <div className="flex h-[70%] flex-col justify-between">
                  <div className=" h-[76%] rounded-2xl ">
                    <AuthorCard
                      id={post.author.id}
                      name={post.author.name}
                      image={post.author.image}
                    />
                  </div>
                  <div className=" flex  h-80 items-center justify-center rounded-xl">
                    Advertise
                  </div>
                </div>
              </div>
            </div>
            <div className=" dark:border-bdr-200 right-2 mb-6 hidden h-[20rem] rounded-lg border md:top-14 lg:sticky lg:block lg:h-[35rem]">
              <div className="flex h-[70%] w-[14rem] flex-col justify-between">
                <div className=" h-[76%] rounded-2xl ">
                  <AuthorCard
                    id={post.author.id}
                    name={post.author.name}
                    image={post.author.image}
                  />
                </div>
                <div className=" flex  h-80 items-center justify-center rounded-xl">
                  Advertise
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
