import { ArrowUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-[140px]"
      >
        <span>{options.find((opt) => opt.value === value)?.label}</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-[140px] rounded-lg border bg-white shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  value === option.value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
