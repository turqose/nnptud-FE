"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const ChatContext = createContext(null)

const mockChatHistories = [
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
]

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(mockChatHistories)
  const [currentChat, setCurrentChat] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const createNewChat = useCallback(() => {
    const newChat = {
      id: Date.now().toString(),
      title: "Chat mới",
      messages: [],
    }
    setChats((prev) => [...prev, newChat])
    setCurrentChat(newChat)
    navigate(`/chat/${newChat.id}`)
  }, [navigate])

  const selectChat = useCallback(
    async (id) => {
      try {
        // const response = await axios.get(`/api/chat/${id}`)
        // const chat = response.data
        const chat = mockChatHistories.find((chat) => chat.id === id)
        setCurrentChat(chat)
        navigate(`/chat/${id}/detail`) // Navigate to ChatDetail page
      } catch (error) {
        console.error("Failed to fetch chat messages:", error)
      }
    },
    [navigate],
  )

  const addMessage = useCallback(
    (content, role) => {
      if (!currentChat) {
        console.warn("No chat selected. Cannot add message.");
        return;
      }

      const newMessage = {
        id: Date.now().toString(),
        content,
        role,
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
            }
          }
          return chat
        }),
      )

      setCurrentChat((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        }
      })
    },
    [currentChat],
  )

  const toggleSidebar = useCallback(() => {
    console.log("Toggling sidebar")
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        createNewChat,
        selectChat,
        addMessage,
        sidebarOpen,
        toggleSidebar,
        setCurrentChat, // Add setCurrentChat to the context value
        setChats, // Add setChats to the context value
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

