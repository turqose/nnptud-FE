import { Maximize2, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Lưu trữ tin nhắn
  const [inputValue, setInputValue] = useState(""); // Lưu trữ giá trị input
  const [isTyping, setIsTyping] = useState(false); // Trạng thái đang gõ
  const [isFullScreen, setIsFullScreen] = useState(false); // Trạng thái toàn màn hình
  const navigate = useNavigate(); // Initialize useNavigate

  // Mở/đóng chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Chuyển đổi trạng thái toàn màn hình
  const toggleFullScreen = () => {
    navigate("/chatbot-fullscreen"); // Chuyển sang trang mới
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return; // Không gửi tin nhắn trống

    // Thêm tin nhắn của người dùng
    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Xóa input

    // Hiển thị trạng thái đang gõ
    setIsTyping(true);

    // Trả lời tự động sau 1 giây
    setTimeout(() => {
      const botMessage = { text: getBotResponse(inputValue), sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false); // Ẩn trạng thái đang gõ
    }, 1000);
  };

  // Hàm trả lời tự động của chatbot
  const getBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("xin chào")) {
      return "Xin chào! Bạn cần giúp gì không?";
    } else if (lowerCaseMessage.includes("cảm ơn")) {
      return "Không có gì! Nếu bạn cần thêm trợ giúp, cứ hỏi nhé!";
    } else if (lowerCaseMessage.includes("giờ")) {
      return `Bây giờ là ${new Date().toLocaleTimeString()}.`;
    } else {
      return "Tôi không hiểu. Bạn có thể hỏi lại không?";
    }
  };

  return (
    <div className={`fixed ${isFullScreen ? "inset-0" : "bottom-8 right-8"} z-50`}>
      {/* Chatbot Button */}
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <span role="img" aria-label="chat" className="text-2xl">
            💬
          </span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`absolute ${isFullScreen ? "inset-0" : "bottom-20 right-0 w-80"} bg-white rounded-lg shadow-lg animate-slide-up`}>
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chatbot</h3>
            <div className="flex gap-2">
            <Maximize2 
              onClick={toggleFullScreen}
              className="text-white hover:text-gray-200 text-2xl cursor-pointer"
            />
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-gray-200 text-2xl"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className={`p-4 ${isFullScreen ? "h-[calc(100%-8rem)]" : "h-60"} overflow-y-auto flex flex-col gap-2`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                } animate-fade-in`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="p-2 rounded-lg max-w-[70%] bg-gray-200 text-gray-800 self-start animate-fade-in">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce mr-1"></span>
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce mr-1"></span>
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Đảm bảo export default component
export default Chatbot;