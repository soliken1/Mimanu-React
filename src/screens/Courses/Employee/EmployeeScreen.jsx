import React from "react";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import fetchUser from "../../../hooks/get/fetchUser";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Link } from "react-router-dom";
const EmployeeScreen = ({ getUser, onLogout }) => {
  const courseId = "1";
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setLoading(false);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-auto h-auto relative">
      <Navbar userData={userData} />
      <div className="flex h-full w-full flex-col gap-5 px-8 py-8 md:flex-row md:px-24 md:py-16 md:mt-20">
        <div className="flex h-full w-full flex-col gap-5 md:w-9/12">
          <div className="flex flex-row items-center justify-center md:justify-between">
            <div className="relative">
              <input
                className="shadow-xy border-0 w-96 rounded-full px-8 py-2"
                placeholder="Find Tags, Course Titles, Employees"
              />
              <svg
                className="absolute right-4 top-2"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.88894 18.7779C14.7982 18.7779 18.7779 14.7982 18.7779 9.88894C18.7779 4.97971 14.7982 1 9.88894 1C4.97971 1 1 4.97971 1 9.88894C1 14.7982 4.97971 18.7779 9.88894 18.7779Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.9999 21.0004L16.1665 16.167"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <label className="text-xl font-bold text-[#152852]">
            Assigned Courses
          </label>
          <div className="flex flex-col flex-wrap gap-5 md:flex-row">
            <Link to={`/course/home/${courseId}`}>
              <div className="shadow-xy relative flex h-[180px] w-full flex-col gap-1 rounded-xl bg-gradient-to-br from-blue-900 to-blue-500 px-8 py-4 md:w-[350px]">
                <label className="max-w-[200px] cursor-pointer text-xl text-white">
                  Leading at the Speed of Trust 4.0
                </label>
                <label className="cursor-pointer text-gray-200">
                  August 30 2024 - December 30 2024
                </label>
                <div className="mt-2 flex flex-row gap-4">
                  <label className="z-0 cursor-pointer rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
                    Leadership
                  </label>
                  <label className="z-10 cursor-pointer rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
                    Trust
                  </label>
                </div>
                <img
                  className="-z-0 absolute bottom-4 right-4"
                  src="/People.png"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex h-full w-full flex-col gap-5 md:w-3/12">
          <div className="pt-4 rounded-xl shadow-md bg-white">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>

          <div className="flex flex-col">
            <label className="text-xl font-bold text-[#152852]">Tasks</label>
            <div className="mt-5 flex flex-col items-center justify-center gap-5">
              <img className="h-20 w-20" src="/confetti.png" />
              <label className="max-w-[125px] text-wrap text-center text-lg text-[#152852]">
                You Have No Tasks Currently!
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScreen;
