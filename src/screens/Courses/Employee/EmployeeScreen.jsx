import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import fetchUser from "../../../hooks/get/fetchUser";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import NavSidebar from "../../../components/NavSidebar";
import HelpButton from "../../../components/HelpButton";
import fetchEmployeeCourse from "../../../hooks/get/fetchEmployeeCourse";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import Loader from "../../../components/Loader";
import fetchAllAvailableTasks from "../../../hooks/get/employee/fetchAllAvailableTasks";
import { MdTask } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaArrowCircleRight } from "react-icons/fa";

const EmployeeScreen = ({ getUser, onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeCourses, setEmployeeCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const courses = await fetchEmployeeCourse(getUser.uid);
        setEmployeeCourses(courses);

        const task = await fetchAllAvailableTasks();
        setTaskData(task);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const filteredEmployeeCourses = employeeCourses.filter((courses) =>
    `${courses.CourseTitle}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-72 h-auto min-h-screen flex flex-col md:flex-row p-12 bg-[#FAF9F6]">
        <div className="md:w-7/12 w-full flex flex-col ">
          <label className="text-2xl font-semibold poppins-normal">
            Dashboard
          </label>
          <label className="text-gray-500 poppins-normal">
            Your Assigned Courses Here
          </label>
          <input
            placeholder="Search Course"
            className="border mt-5 py-2 px-4 rounded-xl w-96 border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="w-full h-auto flex flex-col gap-5 mt-5">
            {filteredEmployeeCourses.length > 0 ? (
              filteredEmployeeCourses.map((course) => (
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
                          <p className="text-gray-500 text-xs mt-5">No Tags</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 flex flex-row justify-between pe-8">
                      <label className="text-sm text-gray-500">
                        Ends on:{" "}
                        {course.CourseEnd.toDate().toLocaleDateString()}
                      </label>
                      <Link
                        to={`/course/${course.id}`}
                        className="text-sm flex flex-row gap-1 items-center"
                      >
                        View Course <MdKeyboardArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <label className="text-gray-500 poppins-normal">
                No courses found.
              </label>
            )}
          </div>
        </div>
        <div className="w-5/12 md:flex hidden flex-col gap-12 items-end justify-evenly mt-20">
          <div className="p-2 shadow-y h-88 w-84 rounded-lg">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>
          <div className="shadow-y h-auto w-84 rounded-lg">
            <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200 rounded-tl-lg rounded-tr-lg">
              <IoMdArrowDropdown />
              <label className="font-semibold text-gray-600">
                Available Tasks
              </label>
            </div>
            <div className="flex flex-col ">
              {taskData.availableTasks.map((task) => (
                <div
                  to={`/course/${task.CourseID}/tasks/${task.id}`}
                  key={task.id}
                  className={`flex flex-row items-center gap-3 py-3 hover:bg-gray-300 px-4 ${
                    task.isAnswered
                      ? "bg-green-100"
                      : "bg-gray-100 hover:bg-gray-300"
                  }`}
                >
                  <MdTask />
                  <div className="flex flex-col text-sm">
                    <label className="cursor-pointer">{task.TaskTitle}</label>
                    <div className="flex flex-row gap-5 text-xs text-gray-600">
                      <label className="cursor-pointer">
                        Available On:{" "}
                        {new Date(
                          task.StartDate.seconds * 1000
                        ).toLocaleDateString()}
                      </label>
                      |
                      <label className="cursor-pointer">
                        Due On:{" "}
                        {new Date(
                          task.EndDate.seconds * 1000
                        ).toLocaleDateString()}
                      </label>
                    </div>
                  </div>
                  {task.isAnswered ? (
                    <div className="flex flex-row justify-end flex-1">
                      <FaCheckCircle className="text-green-600 " />
                    </div>
                  ) : (
                    <Link
                      to={`/course/${task.CourseID}/tasks/${task.id}`}
                      className="flex flex-row justify-end flex-1"
                    >
                      <FaArrowCircleRight className="text-blue-500" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <HelpButton />
    </div>
  );
};

export default EmployeeScreen;
