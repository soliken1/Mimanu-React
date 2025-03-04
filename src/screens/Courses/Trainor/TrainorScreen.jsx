import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddCourseModal from "../../../components/AddCourseModal";
import { ToastContainer } from "react-toastify";
import fetchCoursesByTrainor from "../../../hooks/get/fetchCoursesByTrainor";
import { MdKeyboardArrowRight } from "react-icons/md";

const TrainorScreen = ({ getUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setLoading(false);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const getCourses = async () => {
      const data = await fetchCoursesByTrainor(getUser.uid);
      setCourses(data);
    };

    getCourses();
    fetchAndSetUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen flex flex-row p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-col">
          <label className="text-2xl font-semibold poppins-normal">
            Courses
          </label>
          <label className="text-gray-500 poppins-normal">
            Your Added Courses Here
          </label>
          <div className="w-full h-auto flex flex-row justify-between mt-5">
            <input
              placeholder="Search Course"
              className="border px-4 rounded-xl w-96 border-black"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 cursor-pointer bg-[#152852] flex flex-row items-center gap-4 rounded-lg text-white"
            >
              <FaPlus />
              <label className="cursor-pointer">Add Course</label>
            </button>
          </div>
          <div className="mt-12 w-7/12 h-auto">
            {courses.length > 0 ? (
              <div className="flex flex-col gap-5">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className=" h-38 flex flex-row gap-5 shadow-y rounded-xl"
                  >
                    <div
                      className="rounded-s-lg h-full w-[5vh]"
                      style={{ backgroundColor: course.CourseColor }}
                    ></div>
                    <div className="flex-1  py-4 flex flex-col">
                      <label className="text-lg font-semibold">
                        {course.CourseTitle}
                      </label>
                      <label className="text-sm text-gray-600">
                        {course.CourseDescription}
                      </label>
                      <div className="flex flex-row gap-5">
                        <div className="flex flex-row items-center gap-5 mt-2">
                          {Array.isArray(course.CourseTags) &&
                          course.CourseTags.length > 0 ? (
                            course.CourseTags.map((tag, index) => (
                              <div
                                className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2"
                                key={index}
                              >
                                {tag}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-xs mt-5">
                              No Tags
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 flex flex-row justify-between pe-8">
                        <label className="text-sm text-gray-500">
                          Ends on:{" "}
                          {course.CourseEnd.toDate().toLocaleDateString()}
                        </label>
                        <Link
                          to={`/tcourse/${course.id}`}
                          className="text-sm flex flex-row gap-1 items-center"
                        >
                          View Course{" "}
                          <MdKeyboardArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TrainorScreen;
