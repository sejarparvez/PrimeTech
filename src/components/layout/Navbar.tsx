"use client";
import { ThemeProvider } from "@/app/ThemeProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTwitter } from "react-icons/fa";
import { GrFacebook } from "react-icons/gr";
import { TbBrandAzure } from "react-icons/tb";
import Btn from "../common/button/Btn";
import CategoryHover from "../hover/CategoryHover";
import Tranding from "../hover/Tranding";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible =
        currentScrollPos < 200 || prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <header
      className={`z-[999] flex h-14 w-full justify-between ${
        visible ? "opacity-100 backdrop-blur-md" : "opacity-0"
      } transition-transform duration-500 ease-in-out bg-white dark:bg-primary-200 bg-opacity-80 dark:bg-opacity-80 items-center border-b border-bdr-100 dark:border-bdr-200 lg:px-7 px-2 fixed top-0 left-0`}
    >
      <nav className=" text-sm font-medium flex space-x-4 [&>*]:p-2  items-center ">
        <span>
          <Link
            href={"/"}
            className="flex text-primary-200 items-center space-x-2 text-lg md:text-lg"
          >
            <span className="text-primary-200 dark:text-primary-100">
              <TbBrandAzure size={20} />
            </span>
            <span className="text-primary-200 dark:text-lightgray-100">
              PrimeTech
            </span>
          </Link>
        </span>
        <span className="hidden xl:flex items-center space-x-4 [&>*]:cursor-pointer hover:[&>*]:text-primary-200 dark:hover:[&>*]:text-lightgray-100">
          <CategoryHover />
          <Tranding />
          <span>About Us</span>
          <Link href={"/documentation"}>Documentation</Link>
        </span>
      </nav>

      <div className="flex space-x-3 md:space-x-6 items-center">
        <SearchBar />
        <Link
          target="_blank"
          href={"https://facebook.com/sejarparvez"}
          className="text-darkgray-200 dark:text-darkgray-100 md:flex items-center rounded justify-center p-2 hover:bg-lightgray-100 dark:hover:bg-lightgray-200 hidden"
        >
          <GrFacebook />
        </Link>
        <Link
          target="_blank"
          href={"https://twitter.com/sejarparvez"}
          className="text-darkgray-200 dark:text-darkgray-100 items-center rounded justify-center p-2 hover:bg-lightgray-100 dark:hover:bg-lightgray-200 hidden md:flex"
        >
          <FaTwitter />
        </Link>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />
        </ThemeProvider>
        <div className="hidden md:block">
          {email ? (
            <Btn text="Dashboard" link={`/dashboard`} />
          ) : (
            <Btn text="Log in" link="/signin" />
          )}
        </div>
        <div className="lg:hidden">
          <Menu email={email} />
        </div>
      </div>
    </header>
  );
}
