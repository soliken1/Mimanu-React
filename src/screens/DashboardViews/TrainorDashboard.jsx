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
import ScreenTimeBar from "../../components/ScreenTimeBar";
import ScreenTimeChart from "../../components/ScreenTimeChart";
import fetchTrainerScreenTimeData from "../../hooks/get/trainor/fetchTrainorScreenTime";
import calculateTotalScreenTime from "../../helper/calculateTotalScreenTime";
import SkillRadarChart from "../../components/SkillRadarChart";
import fetchTrainorEmployeePerformance from "../../hooks/get/trainor/fetchTrainorEmployeePerformance";
import fetchAggregatedScreenTimeByTrainor from "../../hooks/get/trainor/fetchAggregatedScreenTimeByTrainor";
import RecentActionTable from "../../components/Admin/Dashboard/RecentActionTable.jsx";

const TrainorDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseCountData, setCourseCountData] = useState(null);
  const [actionCountData, setActionCountData] = useState(null);
  const [enrollmentCountData, setEnrollmentCountData] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [totalTime, setTotalTime] = useState(0);
  const [topScreenTimeData, setTopScreenTimeData] = useState(null);
  const [enrolleePerformaceData, setEnrolleePerformaceData] = useState(null);
  const [enrolleeActionsData, setEnrolleeActionsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const topScreenTime = await fetchTrainerScreenTimeData();
        setTopScreenTimeData(topScreenTime);

        const enrolleePerformace = await fetchTrainorEmployeePerformance(
          getUser.uid
        );
        setEnrolleePerformaceData(enrolleePerformace);

        const enrolleeActions = await fetchAggregatedScreenTimeByTrainor(
          getUser.uid
        );
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} mins`;
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
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
          <div className="md:w-7/12 w-full flex flex-col gap-5">
            <div className=" flex flex-col gap-5">
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
                <ScreenTimeChart
                  timeRange={timeRange}
                  role={userData.UserRole}
                />
              </div>
            </div>
            <div className="h-auto p-6 shadow-y rounded-lg bg-white">
              <h2 className="text-lg font-semibold text-gray-700">
                Recent Employee Actions
              </h2>
              <RecentActionTable enrolleeActionsData={enrolleeActionsData} />
            </div>
          </div>
          <div className="w-5/12 flex flex-col gap-5">
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

export default TrainorDashboard;
