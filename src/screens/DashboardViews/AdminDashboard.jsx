import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import NavSidebar from "../../components/NavSidebar";
import Loader from "../../components/Loader";
import fetchUserCountComparison from "../../hooks/get/fetchUserCountComparison";
import fetchEnrollmentCountComparison from "../../hooks/get/fetchEnrollmentCountComparison";
import TotalEmployee from "../../components/Admin/Dashboard/TotalEmployee";
import TotalEnrollment from "../../components/Admin/Dashboard/TotalEnrollment";
import TotalCourse from "../../components/Admin/Dashboard/TotalCourse";
import fetchCourseCountComparison from "../../hooks/get/fetchCourseCountComparison";
import fetchEmployeeActions from "../../hooks/get/fetchEmployeeActions.js";
import TotalActions from "../../components/Admin/Dashboard/TotalActions";
import ScreenTimeBar from "../../components/ScreenTimeBar.jsx";
import ScreenTimeChart from "../../components/ScreenTimeChart.jsx";
import fetchAllScreenTimeData from "../../hooks/get/fetchAllScreenTimeData.js";
import calculateTotalScreenTime from "../../helper/calculateTotalScreenTime.js";
import fetchEmployeePerformance from "../../hooks/get/fetchEmployeePerformance.js";
import SkillRadarChart from "../../components/SkillRadarChart.jsx";
import fetchUserActions from "../../hooks/get/fetchUserActions.js";
import RecentActionTable from "../../components/Admin/Dashboard/RecentActionTable.jsx";
const AdminDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCountData, setUserCountData] = useState(null);
  const [enrollmentCountData, setEnrollmentCountData] = useState(null);
  const [courseCountData, setCourseCountData] = useState(null);
  const [actionCountData, setActionCountData] = useState(null);
  const [topScreenTimeData, setTopScreenTimeData] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [totalTime, setTotalTime] = useState(0);
  const [enrolleePerformaceData, setEnrolleePerformaceData] = useState(null);
  const [enrolleeActionsData, setEnrolleeActionsData] = useState([]);
  const [searchEmployeeAction, setSearchEmployeeAction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const topScreenTime = await fetchAllScreenTimeData();
        setTopScreenTimeData(topScreenTime);

        const enrolleePerformace = await fetchEmployeePerformance();
        setEnrolleePerformaceData(enrolleePerformace);

        const enrolleeActions = await fetchUserActions();
        setEnrolleeActionsData(enrolleeActions);

        if (topScreenTime) {
          const totalDuration = calculateTotalScreenTime(topScreenTime);
          setTotalTime(totalDuration);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [getUser.uid]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const userCount = await fetchUserCountComparison(timeRange);
        setUserCountData(userCount);

        const enrollmentCount = await fetchEnrollmentCountComparison(timeRange);
        setEnrollmentCountData(enrollmentCount);

        const courseCount = await fetchCourseCountComparison(timeRange);
        setCourseCountData(courseCount);

        const actionCount = await fetchEmployeeActions(timeRange);
        setActionCountData(actionCount);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} mins`;
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen md:p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-row items-center justify-between md:flex-nowrap flex-wrap md:gap-0 gap-5">
          <div className="flex flex-row gap-5 items-center md:p-0 px-4 pt-12 md:px-0 md:pt-0">
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

          <div className="flex gap-2 md:p-0 px-4 md:px-0 md:pt-0">
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
        <div className="flex flex-row md:flex-nowrap md:justify-start justify-evenly flex-wrap md:gap-6 gap-2 items-center mt-5 ">
          <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalEmployee userCountData={userCountData} />
          </div>
          <div className="md:w-1/4 w-52  flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalEnrollment enrollmentCountData={enrollmentCountData} />
          </div>
          <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalCourse courseCountData={courseCountData} />
          </div>
          <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
            <TotalActions actionCountData={actionCountData} />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-5 h-auto mt-8 md:p-0 px-4 md:px-0 md:pt-0">
          <div className="md:w-7/12 w-full flex flex-col gap-5">
            <div className="h-auto min-h-96 p-6 shadow-y rounded-lg bg-white">
              <div className="flex flex-col">
                <label className="text-gray-500">
                  Accumulated Enrollees' Time Spent:
                </label>
                <label className="text-2xl text-gray-700 font-semibold">
                  {formatTime(totalTime)}
                </label>
              </div>
              <ScreenTimeBar screenTimeData={topScreenTimeData} />
              <div className="flex flex-row justify-between mt-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Screen Time Usage
                </h2>
              </div>
              <ScreenTimeChart timeRange={timeRange} />
            </div>
            <div className="h-auto p-6 shadow-y rounded-lg bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Employee Actions
                </h2>
                <input
                  placeholder="Search Employee"
                  className="text-sm px-4 py-2 rounded-md border border-gray-400"
                  onChange={(e) => setSearchEmployeeAction(e.target.value)}
                  value={searchEmployeeAction}
                />
              </div>

              <RecentActionTable
                enrolleeActionsData={enrolleeActionsData}
                searchEmployeeAction={searchEmployeeAction}
              />
            </div>
          </div>
          <div className="md:w-5/12 w-full flex flex-col gap-5">
            <div className="h-auto px-6 py-8 shadow-y rounded-lg flex flex-col bg-white">
              <label className="text-gray-500">
                Employees Average Grading:
              </label>
              <div className="flex flex-col gap-2 mt-1">
                <label
                  className={`text-4xl  ${
                    enrolleePerformaceData.status === "Passing"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {enrolleePerformaceData.status}
                </label>
                <label
                  className={`text-xl w-30 items-center justify-center rounded-lg flex ${
                    enrolleePerformaceData.status === "Passing"
                      ? "text-green-600 bg-green-200"
                      : "text-red-600 bg-red-200"
                  }`}
                >
                  {enrolleePerformaceData.averagePercentage}
                </label>
              </div>
            </div>
            <div className="min-h-96 h-auto p-6 shadow-y flex flex-col rounded-lg bg-white">
              <label className="text-gray-500">
                Average Enrolled Employee Skill
              </label>
              <SkillRadarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
