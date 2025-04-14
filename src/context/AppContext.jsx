// src/context/AppContext.js
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [selectedImage, setSelectedImage] = useState(() => {
    const savedImage = localStorage.getItem("selectedImage");
    return savedImage ? savedImage : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarOpen = localStorage.getItem("sidebarOpen");
    return savedSidebarOpen ? JSON.parse(savedSidebarOpen) : false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const toggleSidebar = () => {
    const newSidebarOpen = !sidebarOpen;
    setSidebarOpen(newSidebarOpen);
    localStorage.setItem("sidebarOpen", JSON.stringify(newSidebarOpen));
  };

  const updateSelectedImage = (image) => {
    setSelectedImage(image);
    localStorage.setItem("selectedImage", image);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        sidebarOpen,
        toggleSidebar,
        selectedImage,
        setSelectedImage: updateSelectedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
