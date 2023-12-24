"use client";
import { ThemeProvider } from "@/app/ThemeProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTwitter } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import ProfileMenu from "../profile/ProfileMenu";
import { Button } from "../ui/button";
import Menu from "./Menu";
import { NavigationMenuDemo } from "./Navigation";
import SearchBar from "./SearchBar";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const image = session?.user?.image;

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
      className={`z-50 flex h-14 w-full justify-between ${
        visible ? "opacity-100 backdrop-blur-md" : "opacity-0"
      } border-bdr-100 dark:border-bdr-200 fixed left-0 top-0 items-center border-b bg-white bg-opacity-80 px-2 transition-transform duration-500 ease-in-out dark:bg-black dark:bg-opacity-80 lg:px-7`}
    >
      <nav className=" flex items-center space-x-4 text-sm font-medium  [&>*]:p-2 ">
        <span>
          <Link
            href={"/"}
            className="text-primary-200 flex items-center space-x-2 text-lg md:text-lg"
          >
            <span className="dark:text-lightgray-100 text-xl font-extrabold text-primary md:text-2xl">
              PrimeTech
            </span>
          </Link>
        </span>
        <span className="hover:[&>*]:text-primary-200 dark:hover:[&>*]:text-lightgray-100 hidden items-center space-x-4 xl:flex [&>*]:cursor-pointer">
          <NavigationMenuDemo />
        </span>
      </nav>

      <div className="flex items-center space-x-3 md:space-x-6">
        <SearchBar />
        <div className="hidden items-center space-x-3 md:flex">
          <Link target="_blank" href={"https://facebook.com/sejarparvez"}>
            <Button variant="ghost" size="icon">
              <FaSquareFacebook />
            </Button>
          </Link>
          <Link target="_blank" href={"https://twitter.com/sejarparvez"}>
            <Button variant="ghost" size="icon">
              <FaTwitter />
            </Button>
          </Link>
        </div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />
        </ThemeProvider>
        <div className="hidden md:block">
          {email && image ? (
            <ProfileMenu />
          ) : (
            <Link href="/signin">
              <Button size="lg">Log In</Button>
            </Link>
          )}
        </div>
        <div className="z-50 lg:hidden">
          <Menu email={email} />
        </div>
      </div>
    </header>
  );
}
