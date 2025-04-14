import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const ImageSearchResult = () => {
  const { selectedImage, setSelectedImage } = useAppContext(); // Lấy ảnh từ context
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem("selectedImage");
    if (savedImage) {
      setSelectedImage(savedImage);
    }
  }, [setSelectedImage]);

  useEffect(() => {
    if (selectedImage) {
      console.log("Tìm kiếm ảnh tương tự:", selectedImage);
      searchImage(selectedImage);
      localStorage.setItem("selectedImage", selectedImage);
    }
  }, [selectedImage]);

  const searchImage = async (imageBase64) => {
    try {
      const file = base64ToFile(imageBase64, "selectedImage.png");
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5000/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setResults(response.data); // Cập nhật danh sách ảnh tương tự
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }

  };

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedImage && (
          <img
            src={selectedImage} // Use base64 string directly
            alt="Ảnh đã chọn"
            className="mt-2 w-40 h-40 object-cover"
          />
        )}
        <h1 className="text-lg font-semibold mt-4">Ảnh tương tự</h1>
        {loading && <p>Đang tìm kiếm...</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
          {results.map((result, index) => (
            <Link to={`/shop/${result.slug}`} className="group" key={index}>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={result.image_url || "/placeholder.svg"}
                  alt={result.image_url}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                />
              </div>
              <p className="mt-2 text-sm text-gray-700 group-hover:underline">
                {result.name}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ImageSearchResult;
