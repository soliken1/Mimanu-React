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
import MonthlyEnrolledCountBarChartTrainor from "../../components/MonthlyEnrolledCountBarChartTrainor.jsx";
import BreakdownBarChart from "../../components/BreakdownBarChart.jsx";
import NavSideLoader from "../../components/Loaders/NavSideLoader.jsx";
import { BarLoader } from "react-spinners";
import TopAnalyticsLoader from "../../components/Loaders/TopAnalyticsLoader.jsx";

const TrainorDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  const [courseCountData, setCourseCountData] = useState(null);
  const [actionCountData, setActionCountData] = useState(null);
  const [enrollmentCountData, setEnrollmentCountData] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [totalTime, setTotalTime] = useState(0);
  const [topScreenTimeData, setTopScreenTimeData] = useState(null);
  const [enrolleePerformaceData, setEnrolleePerformaceData] = useState(null);
  const [enrolleeActionsData, setEnrolleeActionsData] = useState([]);
  const [searchEmployeeAction, setSearchEmployeeAction] = useState("");

  const [userLoading, setUserLoading] = useState(false);
  const [screenTimeLoading, setScreenTImeLoading] = useState(false);
  const [performaceLoading, setPerformanceLoading] = useState(false);
  const [enrolleeActionsLoading, setEnrolleeActionsLoading] = useState(false);
  const [totalTimeLoading, setTotalTimeLoading] = useState(false);

  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [actionsLoading, setActionsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserLoading(true);
        setScreenTImeLoading(true);
        setPerformanceLoading(true);
        setEnrolleeActionsLoading(true);
        setTotalTimeLoading(true);

        const user = await fetchUser(getUser.uid);
        setUserData(user);
        setUserLoading(false);

        const topScreenTime = await fetchTrainerScreenTimeData();
        setTopScreenTimeData(topScreenTime);
        setScreenTImeLoading(false);

        const enrolleePerformace = await fetchTrainorEmployeePerformance(
          getUser.uid
        );
        setEnrolleePerformaceData(enrolleePerformace);
        setPerformanceLoading(false);

        const enrolleeActions = await fetchAggregatedScreenTimeByTrainor(
          getUser.uid
        );
        setEnrolleeActionsData(enrolleeActions);
        setEnrolleeActionsLoading(false);

        if (topScreenTime) {
          const totalDuration = calculateTotalScreenTime(topScreenTime);
          setTotalTime(totalDuration);
          setTotalTimeLoading(false);
        }
      } catch (error) {
        setEmployeeLoading(false);
        setEnrollmentsLoading(false);
        setCoursesLoading(false);
        setActionsLoading(false);
        console.error("Error:", error);
      } finally {
        setEmployeeLoading(false);
        setEnrollmentsLoading(false);
        setCoursesLoading(false);
        setActionsLoading(false);
      }
    };
    fetchData();
  }, [getUser.uid]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setCoursesLoading(true);
        setEnrollmentsLoading(true);
        setActionsLoading(true);

        const courseCount = await fetchCourseCountComparison(
          timeRange,
          getUser.uid
        );
        setCourseCountData(courseCount);
        setCoursesLoading(false);

        const actionCount = await fetchEmployeeActions(timeRange, getUser.uid);
        setActionCountData(actionCount);
        setEnrollmentsLoading(false);

        const enrollmentCount = await fetchEnrollmentCountComparison(
          timeRange,
          getUser.uid
        );
        setEnrollmentCountData(enrollmentCount);
        setActionsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setCoursesLoading(false);
        setEnrollmentsLoading(false);
        setActionsLoading(false);
      } finally {
        setCoursesLoading(false);
        setEnrollmentsLoading(false);
        setActionsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} mins`;
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal overflow-x-hidden">
      {userLoading ? <NavSideLoader /> : <NavSidebar userData={userData} />}
      <div className="w-full flex flex-col md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-row items-center justify-between md:flex-nowrap flex-wrap md:gap-0 gap-5">
          {userLoading ? (
            <BarLoader />
          ) : (
            <div className="flex flex-row gap-5 items-center">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={userData?.UserImg}
              />
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-lg">
                  Welcome Back
                  <label className="font-normal text-gray-600">
                    , {userData?.FirstName} {userData?.LastName}!
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
          )}

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
            <button
              className={`px-3 py-1 rounded ${
                timeRange === "30d" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTimeRange("30d")}
            >
              This Month
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-6 items-center mt-5">
          {coursesLoading ? (
            <>
              <TopAnalyticsLoader type={"TOTAL COURSES"} />
            </>
          ) : (
            <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
              <TotalCourse courseCountData={courseCountData} />
            </div>
          )}
          {enrollmentsLoading ? (
            <TopAnalyticsLoader type={"TOTAL ENROLLMENTS"} />
          ) : (
            <div className="md:w-1/4 w-52  flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
              <TotalEnrollment enrollmentCountData={enrollmentCountData} />
            </div>
          )}
          {actionsLoading ? (
            <TopAnalyticsLoader type={"TOTAL ACTIONS"} />
          ) : (
            <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 bg-white">
              <TotalActions actionCountData={actionCountData} />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-5 h-auto mt-8 md:p-0 px-4 md:px-0 md:pt-0">
          <div className="h-auto w-full min-h-96 p-6 shadow-y rounded-lg bg-white">
            <h2 className="text-lg font-semibold text-gray-700">
              Monthly Enrolled Employees
            </h2>
            <MonthlyEnrolledCountBarChartTrainor trainerUID={getUser.uid} />
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
                  {totalTimeLoading ? (
                    <BarLoader className="mt-2" />
                  ) : (
                    <label className="text-2xl text-gray-700 font-semibold">
                      {formatTime(totalTime)}
                    </label>
                  )}
                </div>
                {screenTimeLoading ? (
                  <BarLoader className="mt-2" />
                ) : (
                  <>
                    <ScreenTimeBar screenTimeData={topScreenTimeData} />
                    <div className="flex flex-row justify-between mt-4 mb-4">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Screen Time Usage
                      </h2>
                    </div>
                    <ScreenTimeChart
                      timeRange={timeRange}
                      role={userData?.UserRole}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="h-auto p-6 shadow-y rounded-lg bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Actions
                </h2>
                <input
                  placeholder="Search Employee"
                  className="text-sm px-4 py-2 rounded-md border border-gray-400"
                  onChange={(e) => setSearchEmployeeAction(e.target.value)}
                  value={searchEmployeeAction}
                />
              </div>
              {enrolleeActionsLoading ? (
                <BarLoader />
              ) : (
                <RecentActionTable
                  enrolleeActionsData={enrolleeActionsData}
                  searchEmployeeAction={searchEmployeeAction}
                />
              )}
            </div>
          </div>
          <div className="w-5/12 flex flex-col gap-5">
            <div className="h-auto px-6 py-8 shadow-y rounded-lg flex flex-col bg-white">
              <label className="text-gray-500">
                Employees Average Grading:
              </label>
              {performaceLoading ? (
                <BarLoader className="mt-2" />
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <label
                    className={`text-4xl  ${
                      enrolleePerformaceData?.status === "Passing"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {enrolleePerformaceData?.status}
                  </label>
                  <label
                    className={`text-xl w-30 items-center justify-center rounded-lg flex ${
                      enrolleePerformaceData?.status === "Passing"
                        ? "text-green-600 bg-green-200"
                        : "text-red-600 bg-red-200"
                    }`}
                  >
                    {enrolleePerformaceData?.averagePercentage}
                  </label>
                </div>
              )}
            </div>
            <div className="min-h-96 h-auto p-6 shadow-y flex flex-col rounded-lg bg-white">
              <label className="text-gray-500">
                Average Enrolled Employee Skill
              </label>
              <SkillRadarChart />
            </div>

            <div className="min-h-96 h-auto p-6 shadow-y flex flex-col rounded-lg bg-white">
              <label className="text-gray-500">Course Average Breakdown:</label>
              {performaceLoading ? (
                <BarLoader className="mt-2" />
              ) : (
                <BreakdownBarChart
                  enrolleePerformaceData={
                    enrolleePerformaceData?.specificCourses
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainorDashboard;
