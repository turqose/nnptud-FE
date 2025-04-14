import { Transition } from "@headlessui/react"
import { MessageCircle, PlusCircle, X } from "lucide-react"
import { Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../../context/ChatContext"

export function ChatSidebar({ isOpen, onClose }) {
  const { chats, currentChat, createNewChat, selectChat, setChats,setCurrentChat } = useChat()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch chat histories
    const fetchChatHistories = async () => {
      try {
        // const response = await axios.get("/api/chat/histories")
        // setChats(response.data)
        setChats([
          {
            id: "1",
            title: "Chat 1",
            messages: [
              { id: "1", content: "Hello", role: "user" },
              { id: "2", content: "Hi there!", role: "assistant" },
            ],
          },
          {
            id: "2",
            title: "Chat 2",
            messages: [
              { id: "3", content: "How are you?", role: "user" },
              { id: "4", content: "I'm good, thanks!", role: "assistant" },
            ],
          },
        ])
      } catch (error) {
        console.error("Failed to fetch chat histories:", error)
      }
    }

    fetchChatHistories()
  }, [setChats])

  const handleSelectChat = (chatId) => {
    selectChat(chatId)
    navigate(`/chat/${chatId}`)
  }

  return (
    <>
      {/* Mobile backdrop */}
      <Transition.Root show={isOpen} as={Fragment}>
        <div className="fixed inset-0 bg-black/30 lg:hidden" onClick={onClose} />
      </Transition.Root>

      {/* Sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl lg:static
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Close button - mobile only */}
          <button onClick={onClose} className="absolute right-2 top-2 p-2 text-gray-500 lg:hidden">
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col h-full">
            {/* New chat button */}
            <div className="p-4">
              <button
                onClick={() => {
                    navigate("/chatbot-fullscreen" , { replace: true });
                    setCurrentChat(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                  hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                Chat mới
              </button>
            </div>

            {/* Chat list */}
            <nav className="flex-1 overflow-y-auto px-2 space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                    ${currentChat?.id === chat.id ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </Transition.Root>
    </>
  )
}

