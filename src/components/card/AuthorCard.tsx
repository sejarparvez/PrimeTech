import Image from "next/image";
import Link from "next/link";

interface Author {
  name: string;
  image: string;
  id: string;
}

function AuthorCard({ id, name, image }: Author) {
  return (
    <div className="flex flex-col h-full justify-between m-2 rounded-lg">
      <span className="font-bold text-primary-200 dark:text-primary-100 underline mx-auto">
        Author Info
      </span>
      <div className="pt-2 flex flex-col gap-4">
        <Link href={`/users/${id}`} className="h-32 w-full">
          <Image
            src={image}
            alt=""
            className="w-80 h-full object-cover mx-auto"
            height={500}
            width={500}
          />
        </Link>
        <Link href={`/users/${id}`} className="flex justify-center px-2">
          <span className="font-extrabold text-xl dark:text-primary-100 text-primary-200">
            {name}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default AuthorCard;
