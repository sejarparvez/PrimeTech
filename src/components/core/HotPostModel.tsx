import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  cover: string;
  author: string;
  time: string;
  heading: string;
  id: string;
}

const encodeForUrl = (str: string) => {
  return encodeURIComponent(str).replace(/%20/g, "_");
};

const HotPostModel: React.FC<Props> = ({ cover, author, time, heading }) => {
  const encodedHeading = encodeForUrl(heading);

  return (
    <Link
      href={`/blog/hotpost/${encodedHeading}`}
      className="mx-auto flex items-center rounded-xl lg:rounded-3xl border-b-4 bg-slate-100 dark:bg-gray-900 dark:text-darkgray-100 shadow-2xl md:w-[45%] border-bdr-200 dark:border-bdr-100  lg:w-[30%]"
    >
      <div className="mx-auto flex flex-col">
        <Image
          src={`${cover}`}
          alt=""
          className="h-52 rounded-xl lg:rounded-3xl"
          height={500}
          width={500}
        />
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>{author}</span>
            <span>{time}</span>
          </div>
          <span className="text-2xl font-bold">{heading}</span>
        </div>
      </div>
    </Link>
  );
};

export default HotPostModel;
