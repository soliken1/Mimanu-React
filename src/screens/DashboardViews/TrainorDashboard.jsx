import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import NavSidebar from "../../components/NavSidebar";
import Loader from "../../components/Loader";
import fetchCourseCountComparison from "../../hooks/get/trainor/fetchTrainorCourseCount";
import TotalCourse from "../../components/Trainor/Dashboard/TotalCourse";
import fetchEmployeeActions from "../../hooks/get/trainor/fetchActionCount";
import TotalActions from "../../components/Trainor/Dashboard/TotalActions";
import fetchEnrollmentCountComparison from "../../hooks/get/trainor/fetchEnrollmentCountComparison";
import TotalEnrollment from "../../components/Trainor/Dashboard/TotalEnrollment";
const TrainorDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseCountData, setCourseCountData] = useState(null);
  const [actionCountData, setActionCountData] = useState(null);
  const [enrollmentCountData, setEnrollmentCountData] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const courseCount = await fetchCourseCountComparison(
          timeRange,
          getUser.uid
        );
        setCourseCountData(courseCount);

        const actionCount = await fetchEmployeeActions(timeRange, getUser.uid);
        setActionCountData(actionCount);

        const enrollmentCount = await fetchEnrollmentCountComparison(
          timeRange,
          getUser.uid
        );
        setEnrollmentCountData(enrollmentCount);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row gap-5 items-center">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userData.UserImg}
            />
            <div className="flex flex-col gap-1">
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

          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${
                timeRange === "24h" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTimeRange("24h")}
            >
              Past 24 Hours
            </button>
            <button
              className={`px-3 py-1 rounded ${
                timeRange === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTimeRange("7d")}
            >
              Past 7 Days
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-6 items-center mt-5">
          <div className="w-1/4 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalCourse courseCountData={courseCountData} />
          </div>
          <div className="w-1/4 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalEnrollment enrollmentCountData={enrollmentCountData} />
          </div>
          <div className="w-1/4 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalActions actionCountData={actionCountData} />
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
