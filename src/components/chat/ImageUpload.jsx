"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        {selectedImage && (
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Preview"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-black rounded-full p-0.5"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xl">+</span>
              </div>
              Tìm kiếm
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
