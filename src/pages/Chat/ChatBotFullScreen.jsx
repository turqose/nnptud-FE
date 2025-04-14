import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { useChat } from "../../context/ChatContext";

const ChatBotFullScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { chatId } = useParams();
  const { selectChat } = useChat();

  useEffect(() => {
    if (chatId) {
      selectChat(chatId);
    }
  }, [chatId, selectChat]);

  return (
      <div className="flex h-screen bg-white">
        <ChatSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1">
          <ChatInterface onOpenSidebar={() => setIsSidebarOpen(true)} />
        </main>
      </div>
   );
};

// Đảm bảo export default component
export default ChatBotFullScreen;
