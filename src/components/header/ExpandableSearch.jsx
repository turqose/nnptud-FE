"use client";

import { debounce } from "lodash";
import { Image, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { useAppContext } from "../../context/AppContext";
import formatCurrency from "../../utils/formatMoney";

export function ExpandableSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedImage } = useAppContext(); // Lấy hàm cập nhật ảnh từ context

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isExpanded]);

  const debouncedHandleInputChange = useRef(
    debounce(async (query) => {
      if (query) {
        try {
          const response = await axiosInstance(`/products/search?q=${query}`);
          const data = response.data;
          setResults(data.slice(0, 5));
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setResults([]);
      }
    }, 300)
  ).current;

  const handleInputChange = (e) => {
    const query = e.target.value;
    debouncedHandleInputChange(query);
  };

  const handleImageSearch = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Cập nhật context với base64
        navigate("/search"); // Chuyển trang
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewClick = () => {
    setResults([]);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        className={`transition-colors hover:text-gray-600 ${
          isExpanded ? "hidden" : "block"
        }`}
        onClick={() => setIsExpanded(true)}
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>

      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-white px-4 py-6 md:absolute md:inset-auto md:right-0 md:top-full md:mt-1 md:w-80 md:rounded-lg md:shadow-lg">
          <form className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 focus:border-gray-500 focus:outline-none"
              onChange={handleInputChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Search by image"
            >
              <Image className="h-5 w-5 text-gray-400" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSearch}
            />
          </form>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute right-4 top-4 md:right-2 md:top-2"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
          {results.length > 0 && (
            <ul className="mt-4 w-full bg-white border border-gray-200 rounded-lg  p-2">
              {results.map((result, index) => (
                <li key={index} className="border-b border-gray-200 py-2 flex">
                  <img
                    src={
                      import.meta.env.VITE_API_URL + "/" + result?.images[0]?.url
                    }
                    className="w-12 h-12 mr-2 object-cover"
                    crossOrigin="anonymous"
                    alt="result.name"
                  />
                  <div className="flex justify-between items-center">
                    {result.name} - {formatCurrency(result.price)}
                    <Link to={`/shop/${result.slug}`} onClick={handleViewClick}>
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
