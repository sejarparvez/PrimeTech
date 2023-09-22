"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbBrandAzure } from "react-icons/tb";
import Btn from "../common/button/Btn";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const image = session?.user?.image;

  const [NavOpen, setNavOpen] = useState(false);

  const HandleClick = () => {
    setNavOpen((prev) => !prev);
  };
  return (
    <>
      <div className=" relative">
        {email && image && (
          <Image
            src={image}
            alt=""
            height={100}
            width={100}
            className="h-8 w-8 rounded-full object-cover"
            onClick={HandleClick}
          ></Image>
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
            <div className="my-4 flex flex-col gap-4 px-8 [&>*]:hover:underline [&>*]:hover:font-semibold">
              <Link href={"/categories"} onClick={HandleClick}>
                Categories
              </Link>
              <Link href={"/category/hotpost"} onClick={HandleClick}>
                Trending
              </Link>
              <Link href={"/documentation"} onClick={HandleClick}>
                Documentation
              </Link>
            </div>
            <hr />
            <div className="px-8 py-6" onClick={HandleClick}>
              {email ? (
                <Btn text="Dashboard" link="/dashboard" />
              ) : (
                <Btn text="Log in" link="/signin" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
