import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import fetchUser from "../../../hooks/get/fetchUser";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import NavSidebar from "../../../components/NavSidebar";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const TrainorScreen = ({ getUser, onLogout }) => {
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
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen flex flex-row p-12 bg-[#FAF9F6]">
        <div className="w-8/12 flex flex-col">
          <label className="text-2xl font-semibold poppins-normal">
            Courses
          </label>
          <label className="text-gray-500 poppins-normal">
            Your Added Courses Here
          </label>
          <div className="w-full h-auto flex flex-row justify-between mt-5">
            <input
              placeholder="Search Course"
              className="border px-4 rounded-xl w-96 border-black"
            />
            <Link
              to="/addcourse"
              className="px-4 py-2 cursor-pointer bg-[#152852] flex flex-row items-center gap-4 rounded-lg text-white"
            >
              <FaPlus />
              <label className="cursor-pointer">Add Course</label>
            </Link>
          </div>
        </div>
        <div className="w-4/12 flex flex-col gap-12 items-center ">
          <div className="p-2 shadow-y h-88 w-84 rounded-lg mt-12">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainorScreen;
