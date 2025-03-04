import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import NavSidebar from "../../components/NavSidebar";

const EmployeeDashboardScreen = ({ getUser, onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        if (data.UserRole === "Admin") {
          navigate("/admindashboard");
        } else if (data.UserRole === "Trainor") {
          navigate("/tdashboard");
        }
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
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-white"></div>
    </div>
  );
};

export default EmployeeDashboardScreen;
