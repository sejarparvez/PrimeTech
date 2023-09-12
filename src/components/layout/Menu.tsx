"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbBrandAzure } from "react-icons/tb";
import Btn from "../common/button/Btn";

export default function Menu({ email }: { email: string | null | undefined }) {
  const [NavOpen, setNavOpen] = useState(false);

  const HandleClick = () => {
    setNavOpen((prev) => !prev);
  };

  return (
    <div className="lg:hidden relative">
      <div
        className={`z-40 flex flex-col gap-1 p-3 duration-300 ${
          NavOpen ? "rotate-[360deg]" : ""
        }`}
        onClick={HandleClick}
      >
        <span
          className={`h-0.5 w-6 bg-primary-200 dark:bg-darkgray-100 duration-300 ${
            NavOpen ? " translate-y-1.5 rotate-45 " : ""
          } `}
        ></span>
        <span
          className={`h-0.5 w-6 bg-primary-200 dark:bg-darkgray-100 duration-300  ${
            NavOpen ? "hidden" : ""
          } `}
        ></span>
        <span
          className={`h-0.5 w-6 bg-primary-200 dark:bg-darkgray-100 duration-300 ${
            NavOpen ? "-rotate-45 duration-300 ease-in-out" : ""
          } `}
        ></span>
      </div>
      <div
        className={`fixed top-0 right-0 z-10 flex h-screen w-full transform justify-end  bg-slate-200 bg-opacity-5 backdrop-blur-sm transition duration-300 ease-out  ${
          NavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex w-9/12 flex-col gap-4 bg-white dark:bg-gray-900 z-50">
          <div className="flex items-center justify-between px-8 py-5 text-primary-200 dark:text-primary-100">
            <Link href={"/"}>
              <TbBrandAzure size={30} />
            </Link>
            <AiOutlineClose size={24} onClick={HandleClick} />
          </div>
          <hr />
          <div className="my-4 flex flex-col gap-4 px-8 hover:bg-black">
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
          <div className="px-8 py-6">
            {email ? (
              <Btn text="Dashboard" link="/dashboard" />
            ) : (
              <Btn text="Log in" link="/signin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
