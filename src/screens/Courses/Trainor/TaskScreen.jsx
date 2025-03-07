import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import fetchTasks from "../../../hooks/get/fetchTasks"; // Updated import
import fetchCourse from "../../../hooks/get/fetchCourse";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import AddTaskModal from "../../../components/AddTaskModal";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdTask } from "react-icons/md";
import { Link } from "react-router-dom";
const TTaskScreen = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState({
    pastTasks: [],
    availableTasks: [],
    upcomingTasks: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const tasksData = await fetchTasks(courseId); // Fetch tasks from subcollection
        setTasks(tasksData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [courseId]);

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
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#152852] px-4 cursor-pointer text-white rounded-lg py-2"
            >
              Add Task
            </button>
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
                  <Link
                    to={`/tcourse/${courseId}/tasks/${task.id}`}
                    key={task.id}
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
                    to={`/tcourse/${courseId}/tasks/${task.id}`}
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
                    to={`/tcourse/${courseId}/tasks/${task.id}`}
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
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
      />
    </div>
  );
};

export default TTaskScreen;
