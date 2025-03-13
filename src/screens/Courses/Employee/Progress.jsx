import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import formatTimestamp from "../../../helper/formatTimestamp";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import calculateTotalScreenTime from "../../../helper/calculateTotalScreenTime"; // Import the function
import ScreenTimeBar from "../../../components/ScreenTimeBar";
import SkillRadarChart from "../../../components/SkillRadarChart";
import CourseProgress from "../../../components/CourseProgress";
import fetchTasks from "../../../hooks/get/fetchTasks";
import { fetchModulesWithReadStatus } from "../../../hooks/get/fetchModulesWithReadStatus";
import { fetchCompletedProgress } from "../../../hooks/get/fetchCompletedProgress";
import ProgressTable from "../../../components/ProgressTable";

const Progress = ({ getUser, onLogout }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [enrollData, setEnrollData] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [tasksData, setTasksData] = useState(null);
  const [totalAvailableTasks, setTotalAvailableTasks] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalReadSubmodules, setTotalReadSubmodules] = useState(0);
  const [totalSubmodules, setTotalSubmodules] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [totalCompletedModules, setTotalCompletedModules] = useState(0);
  const [completedProgress, setCompletedProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const enroll = await fetchEnrolled(getUser.uid, courseId);
        setEnrollData(enroll);

        if (enroll?.ScreenTime) {
          const totalDuration = calculateTotalScreenTime(enroll.ScreenTime);
          setTotalTime(totalDuration);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!enrollData) return;

    trackUserScreenTime(enrollData.id, "Progress");
    if (enrollData?.ScreenTime) {
      setTotalTime(calculateTotalScreenTime(enrollData.ScreenTime));
    }

    const fetchData = async () => {
      try {
        const tasks = await fetchTasks(courseId, enrollData.id);
        setTasksData(tasks);

        // Extract available tasks
        const availableTasks = tasks.availableTasks || [];

        // Count completed tasks from availableTasks
        const completedTasksCount = availableTasks.filter(
          (task) => task.completedData?.Answered
        ).length;

        // Update state
        setTotalAvailableTasks(availableTasks.length);
        setTotalCompletedTasks(completedTasksCount);

        const modules = await fetchModulesWithReadStatus(
          courseId,
          enrollData.id
        );
        setTotalReadSubmodules(modules.totalReadSubmodules);
        setTotalSubmodules(modules.totalSubmodules);

        setTotalCompletedModules(modules.totalCompletedModules);
        setTotalModules(modules.totalModules);

        const progressData = await fetchCompletedProgress(
          courseId,
          enrollData.id
        );
        setCompletedProgress(progressData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [enrollData]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} mins`;
  };

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 ps-66 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <label className="text-xl font-semibold">
              {courseData?.CourseTitle}
            </label>
            <label className="text-sm text-gray-600">
              {courseData?.CourseDescription}
            </label>
          </div>
          <CourseSidebar userData={userData} />
        </div>
        <div className="w-full h-full flex flex-col mt-6">
          <div className="w-full flex flex-row gap-5">
            <div className="flex w-7/12 flex-col">
              <div className="flex flex-row justify-between border-b border-gray-400 pb-2">
                <div className="flex flex-col">
                  <label className="text-gray-500">Total Time on Course:</label>
                  <label className="text-2xl text-gray-700 font-semibold">
                    {formatTime(totalTime)}
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-500">Starting Date:</label>
                  <label className="text-2xl text-gray-700 font-semibold">
                    {enrollData?.DateEnrolled
                      ? formatTimestamp(enrollData.DateEnrolled)
                      : "N/A"}
                  </label>
                </div>
              </div>
              <ScreenTimeBar screenTimeData={enrollData?.ScreenTime || []} />
              <div className="flex h-24 text-xs flex-row gap-5 mt-8">
                <div className="flex gap-4 flex-col w-1/3 text-gray-600 border-s px-4 border-gray-400">
                  <label>Modules Completed:</label>
                  <label className="text-4xl flex flex-row gap-2 items-center">
                    {totalCompletedModules}
                    <label className="text-sm">out of </label>
                    {totalModules}
                  </label>
                </div>
                <div className="flex gap-4 flex-col w-1/3 text-gray-600 border-s px-4 border-gray-400">
                  <label>Submodules Completed:</label>
                  <label className="text-4xl flex flex-row gap-2 items-center">
                    {totalReadSubmodules}
                    <label className="text-sm">out of </label>
                    {totalSubmodules}
                  </label>
                </div>
                <div className="flex gap-4 flex-col w-1/3 text-gray-600 border-s px-4 border-gray-400">
                  <label>Tasks Completed:</label>
                  <label className="text-4xl flex flex-row gap-2 items-center">
                    {totalCompletedTasks}
                    <label className="text-sm">out of </label>
                    {totalAvailableTasks}
                  </label>
                </div>
              </div>
              <div className="w-full h-auto mt-5">
                <ProgressTable
                  completedProgress={completedProgress}
                  tasksData={tasksData}
                />
              </div>
            </div>
            <div className="flex-1 flex-col gap-5 flex">
              <CourseProgress
                totalCompletion={
                  totalCompletedModules +
                  totalCompletedTasks +
                  totalReadSubmodules
                }
                totalCourseProgress={
                  totalAvailableTasks + totalSubmodules + totalModules
                }
              />
              <SkillRadarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
