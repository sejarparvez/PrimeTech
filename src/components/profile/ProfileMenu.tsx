"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbBrandAzure } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";
import Profile from "@/image/profile.png";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email;
  const image = session?.user?.image;

  const [NavOpen, setNavOpen] = useState(false);

  const HandleClick = () => {
    setNavOpen((prev) => !prev);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut();
      router.push("/");
    }
  };
  return (
    <>
      <div className=" relative">
        {email && image ? (
          <Image
            src={image}
            alt=""
            height={100}
            width={100}
            className="h-8 w-8 rounded-full object-cover"
            onClick={HandleClick}
          />
        ) : (
          <Image
            src={Profile}
            alt=""
            height={100}
            width={100}
            className="h-8 w-8 rounded-full object-cover"
            onClick={HandleClick}
          />
        )}

        <div
          className={`fixed top-0 right-0 z-50 flex h-screen w-full transform justify-end  bg-slate-200 bg-opacity-5 backdrop-blur-sm transition duration-300 ease-out  ${
            NavOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex w-3/12 flex-col gap-4 bg-white dark:bg-gray-900 z-50">
            <div className="flex items-center justify-between px-8 py-5 text-primary-200 dark:text-primary-100">
              <Link href={"/"}>
                <TbBrandAzure size={30} />
              </Link>
              <AiOutlineClose size={24} onClick={HandleClick} />
            </div>
            <hr />
            <div className="my-4 flex flex-col gap-4 px-8">
              <Link
                href={"/dashboard"}
                onClick={HandleClick}
                className="flex gap-3 items-end text-base mb-2"
              >
                {image && (
                  <Image
                    src={image}
                    alt=""
                    height={100}
                    width={100}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="font-bold text-xl uppercase">
                  {session?.user?.name && <span>{session.user?.name}</span>}
                </span>
              </Link>
              <Link href={"/newpost"} onClick={HandleClick}>
                New Post
              </Link>
              <Link href={"/editprofile"} onClick={HandleClick}>
                Edit Profile
              </Link>
            </div>
            <hr />
            <div className="px-8 py-6" onClick={HandleClick}>
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
        </div>
      </div>
    </>
  );
}
