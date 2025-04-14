import {
  BarChart,
  ChevronDown,
  ChevronUp,
  List,
  Package,
  ShoppingCart,
  Tag,
  Users
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const menuItems = [
  { name: "Trang tổng quan", icon: BarChart, href: "/admin" },
  {
    name: "Quản lý banner",
    icon: Package,
    subItems: [
      { name: "Danh sách banner", icon: List, href: "/admin/banner" },
      { name: "Thêm banner", icon: Package, href: "/admin/add-banner" },
    ],
  },
  {
    name: "Quản lý sản phẩm",
    icon: Package,
    subItems: [
      { name: "Danh sách sản phẩm", icon: List, href: "/admin/product-list" },
      { name: "Thêm sản phẩm mới", icon: Package, href: "/admin/add-product" },
    ],
  },
  {
    name: "Quản lý danh mục sản phẩm",
    icon: List,
    subItems: [
      { name: "Danh sách danh mục", icon: List, href: "/admin/category-list" },
      { name: "Thêm danh mục mới", icon: Package, href: "/admin/add-category" },
    ],
  },
  {
    name: "Quản lý bài viết",
    icon: Tag,
    subItems: [
      { name: "Danh sách bài viết", icon: List, href: "/admin/post-list" },
      { name: "Thêm bài viết mới", icon: Tag, href: "/admin/add-post" },
    ],
  },
  {
    name: "Quản lý danh mục bài viết",
    icon: Tag,
    subItems: [
      { name: "Danh sách danh mục bài viết", icon: List, href: "/admin/post-category-list" },
      { name: "Thêm danh mục bài viết mới", icon: Tag, href: "/admin/add-post-category" },
    ],
  },
  {
    name: "Quản lý liên hệ",
    icon: Users,
    href: "/admin/contact-list" 
  },
  {
    name: "Quản lý đơn hàng",
    icon: ShoppingCart,
   href: "/admin/order-list"
  },
  {
    name: "Quản lý người dùng",
    icon: Users,
    href: "/admin/user-list" ,
     
  },
];

export default function SidebarAdmin() {
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar } =
    useAppContext();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-transform duration-200 ease-in-out md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${
        darkMode ? "bg-gray-900" : "bg-[#e7ecef]"
      }`}
    >
      {/* Header Sidebar */}
      <div className="flex items-center justify-center mt-2 p-4">
        <h1
          className={`text-xl font-bold transition-all duration-300 ${
            darkMode ? "text-white" : "text-purple-400"
          }`}
        >
          Admin Panel
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-auto px-4 py-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <NavLink
              to={item.href || "#"}
              className={({ isActive }) =>
                `flex items-center justify-start w-full p-3 rounded-lg transition-all ${
                  darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"
                } ${isActive && !item.subItems && location.pathname === item.href ? (darkMode ? "bg-gray-700" : "bg-gray-300") : ""}`
              }
              onClick={() => {
                if (item.subItems) {
                  setOpenSubMenu(openSubMenu === index ? null : index);
                }
              }}
            >
              <item.icon className="w-6 h-6" />
              <span
                className={`ml-3 transition-all duration-300 text-start ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {item.name}
              </span>

              {/* Show arrow if there are subItems */}
              {item.subItems && (
                <span className="ml-auto">
                  {openSubMenu === index ? (
                    <ChevronUp className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`} />
                  )}
                </span>
              )}
            </NavLink>

            {/* Show subItems if openSubMenu is selected */}
            {item.subItems && (
              <div
                className={`pl-6 overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openSubMenu === index && sidebarOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    to={subItem.href}
                    key={subIndex}
                    className={({ isActive }) =>
                      `flex items-center justify-start w-full p-2 rounded-lg transition-all ${
                        darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-black"
                      } ${isActive ? (darkMode ? "bg-gray-700" : "bg-gray-300") : ""}`
                    }
                  >
                    <subItem.icon className="w-5 h-5" />
                    <span className={`ml-3 text-start ${darkMode ? "text-white" : "text-black"}`}>
                      {subItem.name}
                    </span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
