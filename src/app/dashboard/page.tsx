"use client";
import Loading from "@/components/common/loading/Loading";
import RecentPostModel from "@/components/core/RecentPostModel";
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

  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize as true

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false); // Set loading to false if user is not authenticated
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
    <div className="flex flex-col md:gap-10 mt-10">
      {!isLoading && status === "authenticated" ? (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6  w-full  bg-slate-100 dark:bg-gray-900">
            <div className="flex items-center border justify-center col-span-3 md:col-span-1 h-full w-full">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  height={500}
                  width={500}
                  className=" object-cover h-60"
                />
              ) : (
                "No image found"
              )}
            </div>
            <div className="flex flex-col items-center text-center mx-auto w-full col-span-3 md:col-span-1 justify-center gap-6 px-4 md:px-0">
              <div className="text-4xl font-bold uppercase mx-auto">{name}</div>
              <div className="text-xl">{email}</div>
            </div>
            <div className="flex items-center gap-2 justify-center lg:flex-col md:flex-row flex-col md:gap-6  col-span-3 lg:col-span-1">
              <div className="flex items-center justify-center">
                <Link href={"/newpost"}>
                  <button className="font-bold flex gap-4 items-center justify-center px-8 py-2 rounded-lg bg-primary-100 hover:bg-slate-50 text-primary-200 shadow-lg border">
                    New Post
                    <BiSolidEdit size={20} />
                  </button>
                </Link>
              </div>
              {id && (
                <div>
                  <Link href={`/editprofile/?userid=${id}`}>
                    <button className="font-bold flex gap-4 items-center justify-center px-6 py-2 rounded-lg bg-primary-200 hover:bg-gray-800 text-white border">
                      Edit Profile
                      <FaUserEdit size={20} />
                    </button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-center">
                <button
                  onClick={handleLogout}
                  className="font-bold flex gap-4 items-center justify-center px-10 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
                >
                  Log Out
                  <FaPowerOff size={14} />
                </button>
              </div>
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
