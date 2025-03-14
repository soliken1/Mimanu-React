import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import Loader from "../../../components/Loader";
const CourseInfo = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [enrollData, setEnrollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const enroll = await fetchEnrolled(getUser.uid, courseId);
        setEnrollData(enroll);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!enrollData) return;

    trackUserScreenTime(enrollData.id, "Home");
  }, [enrollData]);

  if (loading) {
    return <Loader />;
  }

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
        <div className="w-full h-full flex-flex-row mt-6"></div>
      </div>
    </div>
  );
};

export default CourseInfo;
