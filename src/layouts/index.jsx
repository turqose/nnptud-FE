import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Chatbot from "../pages/Chat/ChatBot";
 
const Layout = () => {
  return (
    <div>
      <Header />
      <main className="pt-16  ">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;
