import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import { useNavigate } from "react-router-dom";
import NavSidebar from "../../components/NavSidebar";
import HelpButton from "../../components/HelpButton";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
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
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal bg-[#FAF9F6]">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen gap-12 flex flex-row mt-12 p-12 ">
        <div className="w-8/12"></div>
        <div className="flex-1 flex flex-col items-end">
          <div className="w-full h-28 gap-4 text-sm rounded-lg shadow-y flex">
            <img
              src="/selfassessment.jpg"
              className="h-full w-32 object-cover rounded-s-lg"
            />
            <div className="flex flex-col justify-evenly">
              <label className="flex items-center">
                Take Your Self-Assessment Here!
              </label>
              <div className="w-full justify-end px-8 flex">
                <Link
                  to="/self-form"
                  className="px-2 py-1 w-30 flex justify-center text-white rounded-sm bg-[#152852]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  );
};

export default EmployeeDashboardScreen;
