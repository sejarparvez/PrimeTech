"use client";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
function Sidebar() {
  const [showMorePopup, setShowMorePopup] = useState(false);

  const toggleMorePopup = () => {
    setShowMorePopup(!showMorePopup);
  };

  return (
    <div className="flex w-48 md:w-40 lg:w-48 h-[86%] flex-col items-center  rounded-2xl border dark:border-bdr-200  py-3 px-4 transition-all duration-700 justify-between">
      <div className="flex w-full max-w-xs flex-col gap-1.5 text-xl">
        <div className="flex flex-col justify-between gap-2">
          <div className="text-2xl font-bold py-3 underline decoration-wavy">
            Categories
          </div>
          <Link href={"/category/technology"}>
            <span>Technology</span>
          </Link>
          <Link href={"/category/game"}>
            <span>Game</span>
          </Link>
          <Link href={"/category/robotics"}>
            <span>Robotics</span>
          </Link>
          <Link href={"/category/lifestyle"}>
            <span>Lifestyle</span>
          </Link>
          <Link href={"/category/ai"}>
            <span>AI</span>
          </Link>
          <Link href={"/category/bussiness"}>
            <span>Business</span>
          </Link>
          <Link href={"/category/phone"}>
            <span>Smart Phone</span>
          </Link>
          <Link href={"/category/computer"}>
            <span>Computer</span>
          </Link>
          <Link href={"/category/laptop"}>
            <span>Laptop</span>
          </Link>
          
        </div>
      </div>

      <span
        className="flex cursor-pointer items-center gap-2 bg-primary-200  py-1.5 rounded-md text-primary-100 justify-center dark:border px-6 mt-6"
        onClick={toggleMorePopup}
      >
        More <FaArrowRight />
      </span>

      {/* Sliding Popup */}
      <div
        className={`fixed top-0 left-0 h-full w-full transform transition-all duration-300 ease-in-out ${
          showMorePopup ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute h-full w-full bg-slate-200 bg-opacity-5 backdrop-blur-sm"></div>
        <div className="absolute left-0 z-50 h-full w-60 bg-white p-6 dark:bg-black">
          <div className="flex items-center justify-between mt-10">
            <h3 className="text-lg font-bold">More Options</h3>
            <button onClick={toggleMorePopup}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
            <li>Option 4</li>
            <li>Option 5</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
