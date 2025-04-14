import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosConfig";
import AccountDetails from "../../components/account/AccountDetail";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";

const AccountPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  const handleUpdateAccount = async (data) => {
    try {
      // In a real app, this would be an API call
      await axiosInstance.put("/users/update", data);
      toast.success("Account updated successfully");
      setUser({ ...user, ...data });
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account");
      return Promise.reject(error);
    }
  };

  const handleChangePassword = async (data) => {
    try {
       await axiosInstance.post("/auth/change-password", data);
       toast.success("Password changed successfully");
       return Promise.resolve();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password");
      return Promise.reject(error);
    }
  };

  if (!user) {
    return (<>
      <GlobalLoading />
    </>)
  }

  return (
    <>
      <AccountDetails user={user} onSubmit={handleUpdateAccount} onPasswordChange={handleChangePassword} />
    </>
  );
};

export default AccountPage;
