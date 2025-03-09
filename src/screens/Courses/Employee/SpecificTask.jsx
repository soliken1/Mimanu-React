import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchTask from "../../../hooks/get/fetchTask";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import { MdKeyboardArrowRight } from "react-icons/md";

const EmployeeSpecificTask = ({ getUser }) => {
  const { courseId, taskId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [task, setTask] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Convert standard YouTube URL to embed format
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const taskData = await fetchTask(courseId, taskId);
        setTask(taskData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

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
        <div className="w-full h-full flex-flex-row mt-6">
          <label className="text-2xl">{task?.TaskTitle}</label>
          {/* Display File if Available */}
          {task?.fileUrl && (
            <div>
              {task.fileUrl.includes(".png") ||
              task.fileUrl.includes(".jpg") ||
              task.fileUrl.includes(".webp") ||
              task.fileUrl.includes(".jpeg") ? (
                <img
                  src={task.fileUrl}
                  alt="Uploaded"
                  className="w-full h-98 object-cover shadow-y rounded-xl"
                />
              ) : (
                <a
                  href={task.fileUrl}
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
              __html: task?.TaskContent,
            }}
            className="text-gray-800 mt-5"
          />

          {task?.EmbedURL && (
            <iframe
              className="w-1/2 h-96"
              src={getEmbedUrl(task?.EmbedURL)}
              title={task.SubmoduleTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          <div className="flex mt-5 justify-end border-t border-gray-400 pt-4">
            <Link
              to={`/course/${courseId}/tasks/${taskId}/questions`}
              className="bg-[#152852] flex items-center px-4 py-2 rounded-md text-white"
            >
              <label className="cursor-pointer">View Assignment</label>
              <MdKeyboardArrowRight />
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeSpecificTask;
