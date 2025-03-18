import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import Loader from "../../../components/Loader";
import "react-quill/dist/quill.snow.css";
import fetchAnnouncements from "../../../hooks/get/fetchAnnouncements";
import { IoMdArrowDropdown } from "react-icons/io";
import { GrAnnounce } from "react-icons/gr";
import { MdTask } from "react-icons/md";
import { Link } from "react-router-dom";
import fetchTasks from "../../../hooks/get/fetchTasks";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

const CourseInfo = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [enrollData, setEnrollData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const announcement = await fetchAnnouncements(courseId);
        setAnnouncementsData(announcement);

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

    trackUserScreenTime(enrollData.id, "Home");

    const fetchModuleData = async () => {
      try {
        const tasks = await fetchTasks(courseId, enrollData.id);
        setTaskData(tasks);

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
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
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
        <div className="w-full h-full flex-flex-row mt-6 px-4 md:px-0 ">
          {/* Display File if Available */}
          {courseData?.fileUrl && (
            <div>
              {courseData.fileUrl.includes(".png") ||
              courseData.fileUrl.includes(".jpg") ||
              courseData.fileUrl.includes(".webp") ||
              courseData.fileUrl.includes(".jpeg") ? (
                <img
                  src={courseData.fileUrl}
                  alt="Uploaded"
                  className="w-full h-60 object-cover shadow-y rounded-xl"
                />
              ) : (
                <a
                  href={submodule.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              )}
            </div>
          )}

          {/* Rich Text Display */}
          <div
            dangerouslySetInnerHTML={{
              __html: courseData?.CourseContent,
            }}
            className="text-gray-800 mt-5"
          />

          <div className="w-full mt-12 min-h-60 flex gap-5 flex-row h-auto">
            <div className="md:w-2/3 w-full flex flex-col">
              <div className="flex flex-row items-center gap-2 p-4 bg-gray-200 rounded-tl-lg rounded-tr-lg">
                <IoMdArrowDropdown />
                <label className="font-semibold text-gray-600">
                  Announcements
                </label>
              </div>
              <div className="flex flex-row justify-between bg-gray-50">
                {announcementsData.length === 0 ? (
                  <p className="text-gray-200">No announcements available.</p>
                ) : (
                  <ul className="space-y-4 w-full ">
                    {announcementsData.map((announcement) => (
                      <>
                        <li
                          key={announcement.id}
                          className="p-3 border-b border-gray-200"
                        >
                          <div className="flex flex-row gap-4 items-center">
                            <GrAnnounce />
                            <div className="flex flex-col">
                              <div className="flex flex-row gap-2 items-center">
                                <h3 className="font-semibold text-gray-800">
                                  {announcement.AnnouncementTitle}
                                </h3>
                                <p className="text-gray-600">
                                  {announcement.AnnouncementDetails}
                                </p>
                              </div>{" "}
                              <p className="text-sm text-gray-400">
                                {new Date(
                                  announcement.createdAt.toDate()
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-1/3 hidden md:relative md:flex flex-col rounded-lg">
              <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200 rounded-tl-lg rounded-tr-lg">
                <IoMdArrowDropdown />
                <label className="font-semibold text-gray-600">
                  Available Tasks
                </label>
              </div>
              <div className="flex flex-col ">
                {taskData.availableTasks.map((task) => (
                  <div
                    to={`/course/${courseId}/tasks/${task.id}`}
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
                        to={`/course/${courseId}/tasks/${task.id}`}
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
      </div>
    </div>
  );
};

export default CourseInfo;
