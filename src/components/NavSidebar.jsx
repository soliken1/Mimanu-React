import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfigs";
import NavbarLoading from "./NavbarLoading";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import NavLoader from "../components/NavLoader";
const NavSidebar = ({ userData }) => {
  const [username, setUsername] = useState("");
  const [userImg, setUserImg] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const displayUser = async () => {
      if (!userData) {
        setUsername("");
        setUserImg(null);
        return;
      }

      if (userData.Username) {
        setUsername(userData.Username);
        setUserImg(userData.UserImg);
        setisLoading(false);
      } else {
        setisLoading(false);
      }
    };

    displayUser();
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
    <div className="w-[32vh] h-auto min-h-screen flex flex-col bg-gradient-to-b from-[#234faf] text-white to-[#152852]">
      <div className="h-32 w-full flex flex-row justify-center items-center gap-2">
        <img src="/book.png" className="h-16 w-16 drop-shadow-lg" />
        <label className="font-semibold">MiManuTMS</label>
      </div>
      <div className="flex-1 flex flex-col justify-between items-center px-12">
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
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;
