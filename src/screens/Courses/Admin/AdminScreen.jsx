import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddCourseModal from "../../../components/AddCourseModal";
import { ToastContainer } from "react-toastify";
import { MdKeyboardArrowRight } from "react-icons/md";
import fetchAllCourses from "../../../hooks/get/fetchAllCourses";
import Loader from "../../../components/Loader";

const AdminScreen = ({ getUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.CourseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const courses = await fetchAllCourses();
        setCourses(courses);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen flex flex-row md:p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-col md:p-0 px-4 pt-12 md:px-0 md:pt-0">
          <label className="text-2xl font-semibold poppins-normal">
            Courses
          </label>
          <label className="text-gray-500 poppins-normal">
            All Courses Available on the Platform
          </label>
          <div className="w-full h-10 flex flex-row md:gap-0 gap-5 justify-between mt-5">
            <input
              placeholder="Search Course"
              className="border px-4 rounded-xl w-96 border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 cursor-pointer bg-[#152852] md:text-wrap text-nowrap flex flex-row items-center gap-4 rounded-lg text-white"
            >
              <FaPlus />
              <label className="cursor-pointer">Add Course</label>
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-5 mt-12 ">
            <div className=" md:w-7/12 w-full h-full">
              {filteredCourses.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className=" h-38 flex flex-row gap-5 shadow-y rounded-xl"
                    >
                      <div
                        className="rounded-s-lg h-full w-[5vh]"
                        style={{ backgroundColor: course.CourseColor }}
                      ></div>
                      <div className="flex-1  py-4 flex flex-col">
                        <div className="flex flex-row justify-between items-center pe-5">
                          <label className="text-lg font-semibold">
                            {course.CourseTitle}
                          </label>
                          <label className="text-gray-600 text-xs flex items-center justify-center flex-row gap-2">
                            Added by:
                            <img
                              className="w-6 object-cover rounded-full h-6"
                              src={course.user.UserImg}
                            />
                            {course.user.Username}
                          </label>
                        </div>

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
                          <div className="flex items-center gap-4">
                            <label className="text-sm text-gray-500">
                              Ends on:{" "}
                              {course.CourseEnd.toDate().toLocaleDateString()}
                            </label>
                            <label
                              className={`text-sm p-1 rounded-sm ${
                                course.Status === "Enabled"
                                  ? "bg-green-200"
                                  : "bg-red-200"
                              } text-gray-500`}
                            >
                              {course.Status || "Enabled"}
                            </label>
                          </div>
                          <Link
                            to={`/acourse/${course.id}`}
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
      </div>

      <ToastContainer />

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AdminScreen;
