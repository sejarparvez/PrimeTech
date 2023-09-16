import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import TrendingPostModel from "./TrendingPostModel";

interface Post {
  id: string;
  coverImage: string;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  title: string;
}

export default function Trending() {
  const [showCategories, setShowCategories] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toggleCategories = (
    show: boolean | ((prevState: boolean) => boolean)
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowCategories(show);
  };

  const handleMouseLeave = () => {
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
    if (!showCategories) {
      return;
    }
    toggleCategories(false);
  };

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const response = await fetch("/api/hotpost");
        const data = await response.json();
        if (data.message === "No Post To Display") {
          setErrorMessage("No hot posts to display");
        } else {
          setHotPosts(data);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Error fetching hot posts");
      }
      setIsLoading(false);
    };
    fetchHotPosts();
  }, []);

  return (
    <div className="relative">
      <span
        className="flex items-center gap-1"
        onMouseEnter={() => toggleCategories(true)}
        onMouseLeave={handleMouseLeave}
      >
        Trending <FaAngleDown />
      </span>

      {showCategories && (
        <div
          className="absolute top-full flex flex-col w-96 gap-2 left-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-300 rounded shadow-md"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : errorMessage ? (
            <div>Error: {errorMessage}</div>
          ) : (
            hotPosts.map((post) => (
              <TrendingPostModel
                image={post.coverImage}
                title={post.title}
                key={post.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
