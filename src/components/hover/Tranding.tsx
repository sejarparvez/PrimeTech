import { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function Tranding() {
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
        Tranding <FaAngleDown />
      </span>

      {showCategories && (
        <div
          className="absolute top-full w-40 left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-md"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {/* Add your categories here */}
          <ul>
            <li>Category 1</li>
            <li>Category 2</li>
            <li>Category 3</li>
            {/* Add more categories as needed */}
          </ul>
        </div>
      )}
    </div>
  );
}
