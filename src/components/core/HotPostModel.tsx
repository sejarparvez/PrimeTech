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
      className="group flex rounded-xl border transition-all duration-300 hover:shadow-2xl dark:shadow-black lg:rounded-2xl"
    >
      <div className="mx-auto flex flex-col">
        <div className="h-40 overflow-clip rounded-xl md:h-48 lg:h-52 lg:rounded-2xl">
          <Image
            src={`${cover}`}
            alt=""
            className=" transition-all duration-300 group-hover:scale-110 "
            height={500}
            width={500}
          />
        </div>
        <div className="flex flex-col gap-3 p-2 md:p-4">
          <div className="flex justify-between text-gray-500 dark:text-gray-300">
            <span>{author}</span>
            <span>{time}</span>
          </div>
          <span className="text-xl font-bold text-primary transition-colors duration-300 md:text-2xl">
            {heading}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotPostModel;
