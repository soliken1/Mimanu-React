import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfigs";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import NavLoader from "./Loader";
import { useNavigate } from "react-router-dom";
const NavSidebar = ({ userData }) => {
  const navigate = useNavigate();
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
        // Clear chat data
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("chatGreeted");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      {userData?.UserRole === "Employee" ? (
        <div className="min-w-[28vh] md:flex hidden max-w-[28vh] fixed h-screen flex-col bg-gradient-to-b from-[#234faf] text-white to-[#152852]">
          <div className="h-32 w-full flex flex-col justify-center items-center gap-2">
            <img src="/mimanusingle.png" className="w-8 me-3" />
            <label className="font-semibold">MiManuTMS</label>
          </div>
          <div className="flex-1 flex flex-col justify-between px-6">
            <div className="flex flex-col gap-4">
              <Link className="flex flex-row gap-2 w-full " to="/dashboard">
                <MdOutlineSpaceDashboard className="w-6 h-6" />
                <label className="cursor-pointer">Dashboard</label>
              </Link>
            </div>
            <div className="pb-20 flex flex-col gap-4">
              <Link className="flex flex-row gap-2 w-full" to="/editprofile">
                <CiSettings className="w-6 h-6" />
                <label className="cursor-pointer">Settings</label>
              </Link>
              <button
                onClick={logout}
                className="flex flex-row gap-2 w-full border-b pb-4 border-white"
              >
                <IoLogOutOutline className="w-6 h-6" />
                <label className="cursor-pointer">Logout</label>
              </button>
              <Link
                to={`/profile/${userData?.UID}`}
                className=" min-w-full w-auto px-1 flex flex-row hover:bg-[#152852] rounded-xl duration-100 items-center gap-4  h-16"
              >
                <img
                  src={userData?.UserImg}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <label className="text-sm text-nowrap cursor-pointer">
                    {userData?.Username}
                  </label>
                  <label
                    className={`px-2 text-xs text-black rounded-xs cursor-pointer ${
                      userData?.UserRole === "Admin"
                        ? "bg-red-200"
                        : userData?.UserRole === "Trainor"
                        ? "bg-amber-200"
                        : "bg-sky-200"
                    }`}
                  >
                    {userData?.UserRole}
                  </label>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="md:hidden fixed md:relative bottom-0 md:w-auto w-full flex-row gap-8 justify-center flex z-10 py-2 bg-[#f8f4fc]">
            {userData?.UserRole === "Admin" ? (
              <div className="flex-row gap-8 justify-center flex ">
                <Link
                  className=" flex flex-col items-center justify-between"
                  to="/admindashboard"
                >
                  <MdOutlineSpaceDashboard className="w-[25px] h-[25px]" />
                  <label className="cursor-pointer">Dashboard</label>
                </Link>

                <Link
                  className=" flex flex-col items-center justify-between"
                  to="/acourse"
                >
                  <FaBook className="w-[21px] h-[21px]" />
                  <label className="cursor-pointer">Courses</label>
                </Link>
                <Link
                  className=" flex flex-col items-center justify-between"
                  to="/register"
                >
                  <FaUsers className="w-6 h-6" />
                  <label className="cursor-pointer">Users</label>
                </Link>
              </div>
            ) : userData?.UserRole === "Trainor" ? (
              <div></div>
            ) : null}
          </div>
          <div className="min-w-[28vh] md:flex hidden max-w-[28vh] fixed h-screen flex-col bg-gradient-to-b from-[#234faf] text-white to-[#152852]">
            <div className="h-32 w-full flex flex-col justify-center items-center gap-2">
              <img src="/mimanusingle.png" className="w-8 me-3" />
              <label className="font-semibold">MiManuTMS</label>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6">
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
                    <Link className="flex flex-row gap-2 w-full " to="/acourse">
                      <FaBook className="w-6 h-6" />
                      <label className="cursor-pointer">Courses</label>
                    </Link>
                    <Link className="flex flex-row gap-2 w-full" to="/register">
                      <FaUsers className="w-6 h-6" />
                      <label className="cursor-pointer">Users</label>
                    </Link>
                  </>
                ) : userData?.UserRole === "Trainor" ? (
                  <>
                    <Link
                      className="flex flex-row gap-2 w-full "
                      to="/tdashboard"
                    >
                      <MdOutlineSpaceDashboard className="w-6 h-6" />
                      <label className="cursor-pointer">Dashboard</label>
                    </Link>
                    <Link className="flex flex-row gap-2 w-full " to="/tcourse">
                      <FaBook className="w-6 h-6" />
                      <label className="cursor-pointer">Courses</label>
                    </Link>
                  </>
                ) : null}
              </div>
              <div className="pb-20 flex flex-col gap-4">
                <Link className="flex flex-row gap-2 w-full" to="/editprofile">
                  <CiSettings className="w-6 h-6" />
                  <label className="cursor-pointer">Settings</label>
                </Link>
                <button
                  onClick={logout}
                  className="flex flex-row gap-2 w-full border-b pb-4 border-white"
                >
                  <IoLogOutOutline className="w-6 h-6" />
                  <label className="cursor-pointer">Logout</label>
                </button>
                <Link
                  to={`/profile/${userData?.UID}`}
                  className=" min-w-full w-auto px-1 flex flex-row hover:bg-[#152852] rounded-xl duration-100 items-center gap-4  h-16"
                >
                  <img
                    src={userData?.UserImg}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <label className="text-sm text-nowrap cursor-pointer">
                      {userData?.Username}
                    </label>
                    <label
                      className={`px-2 text-xs text-black rounded-xs cursor-pointer ${
                        userData?.UserRole === "Admin"
                          ? "bg-red-200"
                          : userData?.UserRole === "Trainor"
                          ? "bg-amber-200"
                          : "bg-sky-200"
                      }`}
                    >
                      {userData?.UserRole}
                    </label>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavSidebar;
