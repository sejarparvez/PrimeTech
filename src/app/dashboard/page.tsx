"use client";
import Loading from "@/components/common/loading/Loading";
import RecentPostModel from "@/components/core/RecentPostModel";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FaPowerOff, FaUserEdit } from "react-icons/fa";

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
  // Add other properties if needed
};

type DashboardDataProps = {
  user: any;
  id: string;
  posts: Post[];
};

export default function Dashboard() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardDataProps>({
    user: {
      id: "",
      posts: [],
    },
    id: "",
    posts: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/dashboard`)
      .then((response) => response.json())
      .then((data: DashboardDataProps) => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      });
  }, [status]);

  const posts = dashboardData.user.posts || [];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut();
      router.push("/");
    }
  };

  const name = session?.user?.name;
  const email = session?.user?.email;
  const id = dashboardData.user.id;
  const image = session?.user?.image;

  return (
    <div className="flex flex-col md:gap-10">
      {!isLoading && status === "authenticated" ? (
        <div className="flex flex-col gap-10">
          <div className="grid w-full grid-cols-1 gap-10 bg-slate-100 p-6  dark:bg-gray-900  md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-3 flex h-full w-full items-center justify-center border md:col-span-1">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  height={500}
                  width={500}
                  className=" h-60 object-cover"
                />
              ) : (
                "No image found"
              )}
            </div>
            <div className="col-span-3 mx-auto flex w-full flex-col items-center justify-center gap-6 px-4 text-center md:col-span-1 md:px-0">
              <div className="mx-auto text-4xl font-bold uppercase">{name}</div>
              <div className="text-xl">{email}</div>
            </div>
            <div className="col-span-3 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-6  lg:col-span-1 lg:flex-col">
              <div className="flex items-center justify-center">
                <Link href={"/newpost"}>
                  <Button size="lg">
                    New Post
                    <BiSolidEdit size={20} />
                  </Button>
                </Link>
              </div>
              {id && (
                <div>
                  <Link href={`/editprofile/?userid=${id}`}>
                    <Button size="lg" variant="outline">
                      Edit Profile
                      <FaUserEdit size={20} />
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-center">
                <Button onClick={handleLogout} size="lg" variant="destructive">
                  Log Out
                  <FaPowerOff size={14} />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className=" flex md:mt-10">
              <span className="mx-auto px-3 text-center text-2xl font-bold md:px-6 md:text-4xl ">
                <span> Every Article Published By </span>

                <span className="text-pink text-3xl font-extrabold md:text-5xl">
                  {name}
                </span>
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
        </div>
      ) : status !== "authenticated" ? (
        <div className="text-center">
          <p>You are not logged in. Log in to access this page.</p>
          <Link href="/signin">Log in</Link>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
