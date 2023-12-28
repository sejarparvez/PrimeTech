import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Input } from "../ui/input";
import Filter from "./Filter";
import Short from "./Short";

export default function Header() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  return (
    <div>
      <div className="mb-6 text-center text-3xl font-bold md:text-5xl">
        All Post
      </div>
      <div className="mx-20 flex flex-col items-center gap-10 md:flex-row">
        {/* Filter by category dropdown */}
        <div>
          <Filter
            selectedCategory={selectedCategory}
            onChange={(ev) => setSelectedCategory(ev.target.value)}
          />
        </div>
        {/* Sort by dropdown */}
        <Short />
        <div className="relative flex items-center md:w-1/2">
          <Input type="text" placeholder="Search By Post Title" />

          <div className=" absolute right-4 text-xl">
            <FaSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
