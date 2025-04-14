import React from "react";
import { Outlet } from "react-router-dom";
import AccountSidebar from "../components/account/AccountSidebar";

const LayoutProfile = () => {
  return (
    <div className="min-h-screen bg-[#e7ecef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <AccountSidebar />
          <div className="md:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutProfile;
