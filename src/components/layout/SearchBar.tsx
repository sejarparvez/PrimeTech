"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCommand, FiSearch } from "react-icons/fi";

type SearchResult = {
  id: number;
  title: string;
  category: string;
};

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = (): void => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = (): void => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleLinkClick = (): void => {
    handleCloseSearch();
  };

  const debouncedSearch = useCallback((query: string) => {
    if (query.length >= 4) {
      setIsLoading(true);

      fetch(`/api/search?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.posts);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    if (shouldFocusInput && searchInputRef.current) {
      searchInputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  useEffect(() => {
    if (isSearchOpen) {
      setShouldFocusInput(true);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        handleCloseSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery, debouncedSearch]);

  // Function to properly encode a string for URLs
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str).replace(/%20/g, "_");
  };

  return (
    <div
      className="border-bdr-100 dark:border-bdr-200 relative flex cursor-pointer items-center justify-between gap-20 rounded-md py-1 pl-4 pr-1 md:border md:shadow-sm"
      onClick={handleSearchClick}
    >
      <div className="text-md hidden font-medium lg:block">
        Search PrimeTech...
      </div>
      <div className="bg-lightgray-100 dark:bg-lightgray-200 hidden scale-90 items-center gap-1 rounded-sm p-0.5 text-sm md:flex">
        <FiCommand />k
      </div>
      <div className="lg:hidden">
        <FiSearch size={16} />
      </div>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex h-screen items-start justify-center bg-black bg-opacity-70 pt-20 backdrop-blur-sm backdrop-filter transition-opacity duration-300 ease-in-out">
          <div className=" relative z-[999] mx-4 mt-20 w-full rounded-lg bg-secondary p-4  md:w-[30rem]">
            <div className="relative">
              <input
                ref={searchInputRef}
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border px-2 py-1 outline-none focus:border-2"
                placeholder="Search"
              />
              <div className="absolute right-2 top-2">
                <FiSearch size={24} color="gray" />
              </div>
            </div>
            {isLoading ? (
              <p className="mt-4">Loading...</p>
            ) : searchQuery === "" ? (
              <p className="mt-4">
                Type minimum 3 character to see the search results.
              </p>
            ) : searchResults.length > 0 ? (
              <ul className="mt-4 max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <li key={result.id} className="border-b py-2 last:border-b-0">
                    <li
                      onClick={handleLinkClick}
                      className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:underline"
                    >
                      <Link
                        href={`/blog/${result.category}/${encodeForUrl(
                          result.title,
                        )}`}
                      >
                        {result.title}
                      </Link>
                    </li>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-500">
                No results found for &#34;{searchQuery}&#34;.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
