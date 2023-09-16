import Image from "next/image";
import Link from "next/link";

export default function TrendingPostModel({
  image,
  title,
}: {
  title: string;
  image: string;
}) {
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str).replace(/%20/g, "_");
  };

  const encodedHeading = encodeForUrl(title);
  return (
    <>
      <Link href={`/blog/hotpost/${encodedHeading}`} className="flex gap-2">
        <Image
          src={image}
          alt=""
          className="h-12 w-16 object-cover"
          height={100}
          width={100}
        ></Image>
        <div className=" font-medium">{title}</div>
      </Link>
    </>
  );
}
