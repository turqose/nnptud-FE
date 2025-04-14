"use client";

import { Menu, Plus, Send, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

export function ChatInterface({ onOpenSidebar }) {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-3.5");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    const newMessage = {
      role: "user",
      content: input || "Image sent",
      image: imagePreview,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    try {
      const formData = new FormData();
      console.log("input", imagePreview);
      formData.append("content", input);
      if (imagePreview) {
        formData.append("image", imagePreview);
      }

      const response = await fetch("https://00c4-34-148-108-88.ngrok-free.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload");
      }

      const data = await response.json();
      const botReply = {
        role: "bot",
        content: data.content || "This is a fake reply from the bot.",
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      const botReply = {
        role: "bot",
        content: "Error: Failed to upload content.",
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePlusClick = () => setShowMenu(!showMenu);

  const handleFileUpload = (e) => {
    e.preventDefault();
    setShowMenu(false);
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(file);
    } else {
      alert("Please select an image file.");
    }
  };

  const handleRemoveImage = () => setImagePreview(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b px-4 h-14">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="ml-4 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-[80%] px-2 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
              {message.image && (
                <img
                  src={URL.createObjectURL(message.image)}
                  alt="User upload"
                  className="mt-2 max-h-40 rounded-lg"
                />
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
              Bot is typing...
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        {imagePreview && (
          <div className="relative inline-block mb-3">
            <img
              src={URL.createObjectURL(imagePreview)}
              alt="Preview"
              className="max-h-40 rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={handlePlusClick}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute bottom-12 left-0 bg-white border rounded-lg shadow-lg w-[200px]">
                <label className="block p-2 cursor-pointer hover:bg-gray-100 w-full">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />{" "}
                  {/* Đã thêm dấu đóng */}
                  Cung cấp hình ảnh da mặt của bạn để soi da miễn phí
                </label>
              </div>
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhắn tin cho ChatGPT"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim() && !imagePreview}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

ChatInterface.propTypes = {
  onOpenSidebar: PropTypes.func.isRequired,
};
