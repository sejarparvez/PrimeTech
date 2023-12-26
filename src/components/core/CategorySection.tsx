import Link from "next/link";
import { MdOutlineArrowRight } from "react-icons/md";
import Options from "../common/post/Options";

export default function CategorySection() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-center text-2xl font-bold">
        Categories
      </div>
      <div className="flex flex-col">
        {Options.map((category, index) => (
          <Link
            href={`/category/${category.value}`}
            key={index}
            className={`${
              index % 2 === 0 ? " bg-secondary" : ""
            } flex items-center rounded p-2`}
          >
            <MdOutlineArrowRight />
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
