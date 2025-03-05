import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
const TCourseInfo = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchAndSetCourseData = async () => {
      try {
        const data = await fetchCourse(courseId);
        setCourseData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetCourseData();
    fetchAndSetUserData();
  }, []);
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 ps-66 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="flex flex-col">
          <label className="text-xl font-semibold">
            {courseData?.CourseTitle}
          </label>
          <label className="text-sm text-gray-600">
            {courseData?.CourseDescription}
          </label>
        </div>
        <div className="w-full h-full flex-flex-row mt-6">
          <CourseSidebar userData={userData} />
          <div className="flex-1 flex flex-col"></div>
        </div>
      </div>
    </div>
  );
};

export default TCourseInfo;
