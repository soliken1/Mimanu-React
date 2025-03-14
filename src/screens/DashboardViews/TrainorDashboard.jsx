import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import NavSidebar from "../../components/NavSidebar";
import Loader from "../../components/Loader";
const TrainorDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAndSetUserData();
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-row gap-5 items-center ">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={userData.UserImg}
          />
          <div className="flex flex-col gap-1 ">
            <label className="font-semibold text-lg">
              Welcome Back
              <label className="font-normal text-gray-600">
                , {userData.FirstName} {userData.LastName}!
              </label>
            </label>
            <label
              className={`px-2 py-1 text-xs text-black rounded-xs w-18 text-center cursor-pointer ${
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
        </div>
        <div className="flex flex-row gap-5 items-center mt-5">
          <div className="w-1/4 h-32 shadow-y rounded-lg">Total Employee</div>
          <div className="w-1/4 h-32 shadow-y rounded-lg">Total Courses</div>
          <div className="w-1/4 h-32 shadow-y rounded-lg">Total Actions</div>
          <div className="w-1/4 h-32 shadow-y rounded-lg">
            Total Enrollments
          </div>
        </div>
        <div className="w-full flex flex-row gap-5 h-auto mt-5">
          <div className="w-7/12 flex flex-col gap-5">
            <div className="h-96 shadow-y rounded-lg">Employee Actions</div>
            <div className="h-96 shadow-y rounded-lg">
              Recent Employee Actions
            </div>
          </div>
          <div className="w-5/12 flex flex-col gap-5">
            <div className="h-52 shadow-y rounded-lg">
              Employee Grading State
            </div>
            <div className="h-80 shadow-y rounded-lg">
              Average Employee Skill
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainorDashboard;
