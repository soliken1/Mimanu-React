import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import fetchUser from "../../../hooks/get/fetchUser";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import NavSidebar from "../../../components/NavSidebar";
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
      <div className="w-full ps-72 h-auto min-h-screen flex flex-row p-12 bg-white">
        <div className="w-8/12"></div>
        <div className="w-4/12 flex justify-center">
          <div className="p-2 shadow-y h-88 rounded-lg">
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
