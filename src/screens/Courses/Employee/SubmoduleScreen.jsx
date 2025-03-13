import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams, useNavigate } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchSubmodule from "../../../hooks/get/fetchSubmodule";
import "react-quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import fetchSubmodules from "../../../hooks/get/fetchSubmodules";
import { trackUserScreenTime } from "../../../helper/userScreenTime";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import CompletedSubmodules from "../../../hooks/post/addCompleteSubmodule";
import { markModuleAsRead } from "../../../hooks/post/markModuleAsRead";

const SubmoduleScreen = ({ getUser }) => {
  const { courseId, moduleId, submoduleId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [submodule, setSubmodule] = useState(null);
  const [submodules, setSubmodules] = useState([]); // Store all submodules
  const [currentIndex, setCurrentIndex] = useState(0); // Track current submodule index
  const [enrollData, setEnrollData] = useState(null);

  const navigate = useNavigate();

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

        const submoduleData = await fetchSubmodule(
          courseId,
          moduleId,
          submoduleId
        );

        const enroll = await fetchEnrolled(getUser.uid, courseId);
        setEnrollData(enroll);

        const fetchedSubmodules = await fetchSubmodules(courseId, moduleId);
        setSubmodules(fetchedSubmodules);

        setSubmodule(submoduleData);

        // Find the current submodule index
        const index = fetchedSubmodules.findIndex(
          (sub) => sub.id === submoduleId
        );
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [courseId, moduleId, submoduleId]);

  useEffect(() => {
    if (!enrollData) return;

    trackUserScreenTime(enrollData.id, "Submodule");

    try {
      const checkModuleCompletion = async () => {
        await markModuleAsRead(enrollData.id, courseId, moduleId, submoduleId);
      };

      checkModuleCompletion();
    } catch (error) {
      console.error("Error:", error);
    }
  }, [enrollData]);

  useEffect(() => {
    const markSubmoduleAsRead = async () => {
      if (!enrollData || !submodule) return;

      await CompletedSubmodules(courseId, moduleId, submoduleId, enrollData.id);
    };

    markSubmoduleAsRead();
  }, [submodule]); // Trigger when submodule changes

  // Navigate to the next submodule
  const handleNext = () => {
    if (currentIndex < submodules.length - 1) {
      const nextSubmoduleId = submodules[currentIndex + 1].id;
      navigate(
        `/course/${courseId}/modules/${moduleId}/submodules/${nextSubmoduleId}`
      );
    }
  };

  // Navigate to the previous submodule
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSubmoduleId = submodules[currentIndex - 1].id;
      navigate(
        `/course/${courseId}/modules/${moduleId}/submodules/${prevSubmoduleId}`
      );
    }
  };

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
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-2xl">{submodule?.SubmoduleTitle}</label>
            </div>

            {/* Display File if Available */}
            {submodule?.fileUrl && (
              <div>
                {submodule.fileUrl.includes(".png") ||
                submodule.fileUrl.includes(".jpg") ||
                submodule.fileUrl.includes(".webp") ||
                submodule.fileUrl.includes(".jpeg") ? (
                  <img
                    src={submodule.fileUrl}
                    alt="Uploaded"
                    className="w-full h-98 object-cover shadow-y rounded-xl"
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
                __html: submodule?.SubmoduleContent,
              }}
              className="text-gray-800"
            />

            {submodule?.EmbedURL && (
              <iframe
                className="w-1/2 h-96"
                src={getEmbedUrl(submodule?.EmbedURL)}
                title={submodule.SubmoduleTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 border-t border-gray-400 pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-md flex flex-row items-center ${
              currentIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#152852] text-white cursor-pointer"
            }`}
          >
            <MdKeyboardArrowLeft />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === submodules.length - 1}
            className={`px-4 py-2 rounded-md flex flex-row items-center ${
              currentIndex === submodules.length - 1
                ? "bg-gray-400 cursor-not-allowed "
                : "bg-[#152852] text-white cursor-pointer"
            }`}
          >
            Next
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SubmoduleScreen;
