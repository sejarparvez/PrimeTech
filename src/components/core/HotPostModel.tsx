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
      className="flex rounded-xl lg:rounded-2xl border group dark:shadow-black duration-300 transition-all hover:shadow-2xl"
    >
      <div className="mx-auto flex flex-col">
        <div className="rounded-xl lg:rounded-2xl overflow-clip h-52">
          <Image
            src={`${cover}`}
            alt=""
            className=" group-hover:scale-110 duration-300 transition-all "
            height={500}
            width={500}
          />
        </div>
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
