import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import formatTimestamp from "../../../helper/formatTimestamp";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import calculateTotalScreenTime from "../../../helper/calculateTotalScreenTime"; // Import the function
import ScreenTimeBar from "../../../components/ScreenTimeBar";
const Progress = ({ getUser, onLogout }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [enrollData, setEnrollData] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

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
            <div className="flex w-2/3 flex-col">
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
            </div>
            <div className="flex-1 debug"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
