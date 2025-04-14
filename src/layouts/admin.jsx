import { Switch } from "@headlessui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/sidebar/SidebarAdmin";
import { useAppContext } from "../context/AppContext";

const LayoutAdmin = () => {
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar } =
    useAppContext();

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
      <SidebarAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-20 ${sidebarOpen ? "ml-64" : "ml-0"} transition-margin duration-300`}>
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              {/* Toggle Sidebar Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {sidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search..."
                className="ml-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent"
              />
            </div>

            {/* Dark Mode Toggle */}
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${
                darkMode ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Dark Mode</span>
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>
        </header>

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto mt-16 p-4 bg-gray-100 dark:bg-gray-800 ${
            sidebarOpen ? "ml-64" : "ml-0"
          } transition-margin duration-300`}
        >
          {" "}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
