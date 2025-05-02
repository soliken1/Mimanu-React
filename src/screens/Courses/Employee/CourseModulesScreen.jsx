import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchModules from "../../../hooks/get/fetchModulesandSubmodules";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdLibraryBooks } from "react-icons/md";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import { fetchModulesWithReadStatus } from "../../../hooks/get/fetchModulesWithReadStatus";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "../../../components/Loader";

const CourseModules = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
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
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!enrollData) return;

    trackUserScreenTime(enrollData.id, "Module");

    const fetchModuleData = async () => {
      try {
        const modules = await fetchModulesWithReadStatus(
          courseId,
          enrollData.id
        );
        setModules(modules.modules);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules and submodules:", error);
      }
    };

    fetchModuleData();
  }, [enrollData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen md:p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:p-0 px-4 pt-12 md:px-0 md:pt-0">
            <label className="text-xl font-semibold">
              {courseData?.CourseTitle}
            </label>
            <label className="text-sm text-gray-600">
              {courseData?.CourseDescription}
            </label>
          </div>
          <CourseSidebar userData={userData} />
        </div>
        <div className="w-full h-full flex flex-col mt-6 md:p-0 px-4 md:px-0 md:pt-0">
          <div className="flex justify-between">
            <label className="text-xl font-semibold">Course Modules</label>
          </div>
          <div className="md:w-9/12 w-full h-auto flex flex-col gap-12 mt-5">
            {modules.length > 0 ? (
              modules.map((module) => (
                <div
                  className=" rounded-md border-gray-300 border-t border-s border-r"
                  key={module.id}
                >
                  {/* MODULE HEADER */}
                  <div className="flex flex-row justify-between p-4 bg-gray-200">
                    <div className="flex gap-2 items-center">
                      <IoMdArrowDropdown />
                      <label className="font-semibold">
                        {module.ModuleTitle}
                      </label>
                    </div>
                  </div>

                  {/* SUBMODULE LIST */}
                  <div className="">
                    {module.submodules.length > 0 ? (
                      module.submodules.map((submodule) => (
                        <div
                          key={submodule.id}
                          className={`flex justify-between items-center border-b border-gray-300 pe-4 ps-1 hover:bg-gray-300 ${
                            submodule.hasRead
                              ? "bg-gray-200 text-gray-500"
                              : "bg-gray-100"
                          }`}
                        >
                          <Link
                            to={`/course/${courseId}/modules/${module.id}/submodules/${submodule.id}`}
                            className="w-full p-4 flex flex-row gap-2 items-center"
                          >
                            <MdLibraryBooks />
                            {submodule.SubmoduleTitle}
                          </Link>
                          {submodule.hasRead && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 p-3">
                        No Submodules Yet.
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 w-full text-center">
                No Modules Yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseModules;
