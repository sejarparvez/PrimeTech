import Link from "next/link";
import { MdOutlineArrowRight } from "react-icons/md";
import Options from "../common/post/Options";

export default function CategorySection() {
  return (
    <div>
      <div className="flex items-center justify-center mb-8 font-bold text-2xl decoration-wavy underline">
        Categories
      </div>
      <div className="flex flex-col">
        {Options.map((category, index) => (
          <Link
            href={`/category/${category.value}`}
            key={index}
            className={`${
              index % 2 === 0 ? "bg-slate-100 dark:bg-darkgray-200" : ""
            } text-primary-200 dark:text-primary-100 dark:hover:text-[#007bff] hover:text-[#007bff] p-2 rounded flex items-center`}
          >
            <MdOutlineArrowRight />
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
