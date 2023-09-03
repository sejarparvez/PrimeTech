import Link from "next/link"; // Import Link from Next.js
import { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function CategoryHover() {
  const [showCategories, setShowCategories] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCategories = (
    show: boolean | ((prevState: boolean) => boolean)
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowCategories(show);
  };

  const handleMouseLeave = () => {
    // Add a delay of 500 milliseconds (adjust as needed)
    timeoutRef.current = setTimeout(() => {
      setShowCategories(false);
    }, 500);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Ensure the dropdown closes when the mouse leaves it
    if (!showCategories) {
      return;
    }
    toggleCategories(false);
  };

  return (
    <div className="relative">
      <span
        className="flex items-center gap-1 cursor-pointer"
        onMouseEnter={() => toggleCategories(true)}
        onMouseLeave={handleMouseLeave}
      >
        Categories <FaAngleDown />
      </span>

      {showCategories && (
        <div
          className="absolute  w-80 -left-10 mt-1 p-2 bg-white dark:bg-gray-800  border border-gray-300 rounded shadow-md"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <div className="grid grid-cols-2 gap-2 dark:hover:[&>*]:bg-black hover:[&>*]:bg-gray-200 [&>*]:cursor-pointer [&>*]:py-2 [&>*]:px-2 ">
            <Link href="/category2">Category 1</Link>
            <Link href="/category2">Category 2</Link>
            <Link href="/category2">Category 3</Link>
            <Link href="/category2">Category 4</Link>
            <Link href="/category2">Category 5</Link>
            <Link href="/category2">Category 6</Link>
          </div>
        </div>
      )}
    </div>
  );
}
