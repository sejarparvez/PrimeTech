import { FiClock, FiUser } from "react-icons/fi";

import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

interface Props {
  cover: string;
  title: string;
  summary: string;
  author: { name: string };
  createdAt: string;
  category: string;
  _id: string;
}

function RecentPostModel({
  cover,
  title,
  author,
  createdAt,
  category,
  summary,
}: Props) {
  const timeAgo = dayjs(createdAt).locale("en").fromNow();

  // Function to properly encode a string for URLs
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str).replace(/%20/g, "_");
  };

  const encodedTitle = title ? encodeForUrl(title) : "";

  const plainTextContent = summary ? summary.replace(/<[^>]+>/g, "") : "";
  const sum = plainTextContent.slice(0, 150);

  return (
    <div className="flex flex-col border p-3 rounded-2xl lg:w-[85%] md:gap-20 group hover:shadow-2xl dark:shadow-black duration-300 transition-all">
      <Link href={`/blog/${category}/${encodedTitle}`}>
        <div className="hidden rounded-xl lg:rounded-xl md:block">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-5 h-48 overflow-clip rounded-md">
              <Image
                src={`${cover}`}
                alt=""
                className="object-cover h-48 group-hover:scale-110 duration-300 transition-all"
                height={500}
                width={500}
              />
            </div>
            <div className="col-span-7 flex flex-col justify-between gap-4">
              <h1 className="text-2xl font-bold dark:text-darkgray-100">
                {title}
              </h1>

              <div className="text-gray-700 dark:text-gray-300">{sum}...</div>
              <div className="w-full text-sm text-gray-700 dark:text-gray-400 ">
                <div className="flex justify-between">
                  <span className="flex gap-2">
                    <FiUser size="20" />
                    <span>{author.name}</span>
                  </span>
                  <span className="flex gap-2">
                    <FiClock size="20" />
                    <span>{timeAgo}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="mx-auto w-full rounded-xl border-b-4 border-primary-200 dark:border-primary-100 bg-slate-100 p-3 dark:bg-gray-900 md:hidden">
        <Link href={`/blog/${category}/${encodedTitle}`}>
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 md:relative">
              <h1 className="text-2xl font-bold">{title}</h1>

              <div>
                <Image
                  src={`${cover}`}
                  alt=""
                  className="float-left mr-4 h-24 w-40"
                  height={500}
                  width={500}
                />

                <span>{sum}....</span>
              </div>

              <div className="bottom-0 w-full text-sm text-gray-700 dark:text-gray-400 md:absolute">
                <div className="flex justify-between">
                  <span className="flex gap-2">
                    <span>
                      <FiUser size="20" />
                    </span>
                    <span>{author.name}</span>
                  </span>
                  <span className="flex gap-2">
                    <span>
                      <FiClock size="20" />
                    </span>
                    <span>{timeAgo}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default RecentPostModel;
