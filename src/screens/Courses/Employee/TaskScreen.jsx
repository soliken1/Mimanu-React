import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import fetchTasks from "../../../hooks/get/fetchTasks"; // Updated import
import fetchCourse from "../../../hooks/get/fetchCourse";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdTask } from "react-icons/md";
import { Link } from "react-router-dom";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";

const TaskScreen = ({ getUser, onLogout }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [tasks, setTasks] = useState({
    pastTasks: [],
    availableTasks: [],
    upcomingTasks: [],
  });
  const [enrollData, setEnrollData] = useState(null);

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
  }, [courseId]);

  useEffect(() => {
    if (!enrollData) return;

    trackUserScreenTime(enrollData.id, "Task");
  }, [enrollData]);

  useEffect(() => {
    if (!enrollData || !courseId) return;

    const fetchTasksData = async () => {
      try {
        const tasksData = await fetchTasks(courseId, enrollData.id);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasksData();
  }, [enrollData, courseId]); // Depend on enrollData
  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
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

        <div className="w-full h-full flex-flex-row mt-6">
          <div className="flex justify-between">
            <label className="text-xl font-semibold">Course Tasks</label>
          </div>

          {/* Task Sections */}
          <div className="w-9/12 h-auto flex flex-col gap-12 mt-5">
            {/* Available Tasks */}
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200">
                <IoMdArrowDropdown />
                <label>Available Tasks</label>
              </div>
              {tasks.availableTasks.length > 0 ? (
                tasks.availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 shadow flex flex-row items-center border-b justify-between border-gray-300
        ${task.isAnswered ? "bg-green-100" : "bg-gray-100 hover:bg-gray-300"}`}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <MdTask />
                      <div className="flex flex-col text-sm">
                        <label>{task.TaskTitle}</label>
                        <div className="flex flex-row gap-5 text-xs text-gray-600">
                          <label>
                            Available On:{" "}
                            {new Date(
                              task.StartDate.seconds * 1000
                            ).toLocaleDateString()}
                          </label>
                          |
                          <label>
                            Due On:{" "}
                            {new Date(
                              task.EndDate.seconds * 1000
                            ).toLocaleDateString()}
                          </label>
                        </div>
                      </div>
                    </div>
                    {task.isAnswered ? (
                      <div className="flex flex-row gap-5">
                        <label className="text-xs font-semibold text-gray-400">
                          {task.completedData.Score} /{" "}
                          {task.completedData.TotalQuestions}
                        </label>
                        <span className="text-green-600 text-xs font-semibold">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <Link
                        to={`/course/${courseId}/tasks/${task.id}`}
                        className="ml-auto text-blue-500 text-xs"
                      >
                        Start Task
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 p-4">No available tasks.</p>
              )}
            </div>

            {/* Upcoming Tasks */}
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200">
                <IoMdArrowDropdown />
                <label>Upcoming Tasks</label>
              </div>

              {tasks.upcomingTasks.length > 0 ? (
                tasks.upcomingTasks.map((task) => (
                  <Link
                    to={`/course/${courseId}/tasks/${task.id}`}
                    key={task.id}
                    className="p-4 shadow  flex flex-row items-center gap-3 bg-gray-100 border-b border-gray-300 hover:bg-gray-300"
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
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 p-4">No upcoming tasks.</p>
              )}
            </div>

            {/* Past Tasks */}
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200">
                <IoMdArrowDropdown />
                <label>Past Tasks</label>
              </div>
              {tasks.pastTasks.length > 0 ? (
                tasks.pastTasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/course/${courseId}/tasks/${task.id}`}
                    className="p-4 shadow flex flex-row items-center gap-3 bg-gray-100 border-b border-gray-300 hover:bg-gray-300"
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
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 p-4">No past tasks.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskScreen;
