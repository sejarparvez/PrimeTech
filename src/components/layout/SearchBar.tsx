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
      className="relative md:border border-bdr-100 md:shadow-sm dark:border-bdr-200 py-1 pr-1 pl-4 flex gap-20 items-center justify-between rounded-md cursor-pointer"
      onClick={handleSearchClick}
    >
      <div className="font-medium text-md hidden lg:block">
        Search PrimeTech...
      </div>
      <div className="hidden md:flex items-center text-sm bg-lightgray-100 dark:bg-lightgray-200 gap-1 scale-90 p-0.5 rounded-sm">
        <FiCommand />k
      </div>
      <div className="lg:hidden">
        <FiSearch size={24} />
      </div>
      {isSearchOpen && (
        <div className="pt-20 fixed h-screen inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 backdrop-blur-sm backdrop-filter transition-opacity duration-300 ease-in-out">
          <div className="relative z-[999] mt-20 w-full rounded-lg bg-primary-100 dark:bg-black p-4 md:w-[30rem] mx-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border px-2 py-1 outline-none focus:border-2 focus:border-cyan"
                placeholder="Search"
              />
              <div className="absolute right-2 top-2">
                <FiSearch size={24} color="gray" />
              </div>
            </div>
            {isLoading ? (
              <p className="mt-4 text-gray-500">Loading...</p>
            ) : searchQuery === "" ? (
              <p className="mt-4 text-gray-500">
                Type minimum 3 character to see the search results.
              </p>
            ) : searchResults.length > 0 ? (
              <ul className="mt-4 max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <li key={result.id} className="border-b py-2 last:border-b-0">
                    <li
                      onClick={handleLinkClick}
                      className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    >
                      <Link
                        href={`/blog/${result.category}/${encodeForUrl(
                          result.title
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
