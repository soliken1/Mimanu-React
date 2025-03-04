import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfigs";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import NavLoader from "../components/NavLoader";
const NavSidebar = ({ userData }) => {
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const awaitUserData = async () => {
      if (!userData) {
        return;
      }
      setisLoading(false);
    };

    awaitUserData();
  }, [userData]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  if (isLoading) {
    return <NavLoader />;
  }
  return (
    <div className="min-w-[28vh] max-w-[28vh] fixed h-screen flex flex-col bg-gradient-to-b from-[#234faf] text-white to-[#152852]">
      <div className="h-32 w-full flex flex-row justify-center items-center gap-2">
        <img src="/book.png" className="h-16 w-16 drop-shadow-lg" />
        <label className="font-semibold">MiManuTMS</label>
      </div>
      <div className="flex-1 flex flex-col justify-between px-8">
        <div className="flex flex-col gap-4">
          {userData?.UserRole === "Admin" ? (
            <>
              <Link
                className="flex flex-row gap-2 w-full "
                to="/admindashboard"
              >
                <MdOutlineSpaceDashboard className="w-6 h-6" />
                <label className="cursor-pointer">Dashboard</label>
              </Link>
              <Link className="flex flex-row gap-2 w-full" to="/register">
                <FaUsers className="w-6 h-6" />
                <label className="cursor-pointer">Users</label>
              </Link>
            </>
          ) : (
            <>
              <Link className="flex flex-row gap-2 w-full " to="/dashboard">
                <MdOutlineSpaceDashboard className="w-6 h-6" />
                <label className="cursor-pointer">Dashboard</label>
              </Link>
              <Link className="flex flex-row gap-2 w-full " to="/course">
                <FaBook className="w-6 h-6" />
                <label className="cursor-pointer">Courses</label>
              </Link>
            </>
          )}
        </div>
        <div className="pb-20 flex flex-col gap-4">
          <Link className="flex flex-row gap-2 w-full" to="/editprofile">
            <CiSettings className="w-6 h-6" />
            <label className="cursor-pointer">Settings</label>
          </Link>
          <button onClick={logout} className="flex flex-row gap-2 w-full">
            <IoLogOutOutline className="w-6 h-6" />
            <label className="cursor-pointer">Logout</label>
          </button>
          <Link
            to="/profile"
            className="mt-5 w-full flex flex-row items-center gap-4 border-t border-white h-16"
          >
            <img
              src={userData.UserImg}
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <label className="text-sm text-nowrap">{userData.Username}</label>
              <label
                className={`px-2 text-xs text-black rounded-xs ${
                  userData.UserRole === "Admin"
                    ? "bg-red-200"
                    : userData.UserRole === "Trainor"
                    ? "bg-amber-200"
                    : "bg-sky-200"
                }`}
              >
                {userData.UserRole}
              </label>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;
