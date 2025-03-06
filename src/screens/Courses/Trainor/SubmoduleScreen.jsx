import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams, useNavigate } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchSubmodule from "../../../hooks/get/fetchSubmodule";
import updateSubmodule from "../../../hooks/update/updateSubmodule";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import fetchSubmodules from "../../../hooks/get/fetchSubmodules";

const TSubmoduleScreen = ({ getUser }) => {
  const { courseId, moduleId, submoduleId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [submodule, setSubmodule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submodules, setSubmodules] = useState([]); // Store all submodules
  const [currentIndex, setCurrentIndex] = useState(0); // Track current submodule index

  const navigate = useNavigate();

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

        const fetchedSubmodules = await fetchSubmodules(courseId, moduleId);
        setSubmodules(fetchedSubmodules);

        setSubmodule(submoduleData);
        setNewTitle(submoduleData?.SubmoduleTitle || "");
        setNewContent(submoduleData?.SubmoduleContent || "");
        setFileUrl(submoduleData?.fileUrl || "");

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

  // Navigate to the next submodule
  const handleNext = () => {
    if (currentIndex < submodules.length - 1) {
      const nextSubmoduleId = submodules[currentIndex + 1].id;
      navigate(
        `/tcourse/${courseId}/modules/${moduleId}/submodules/${nextSubmoduleId}`
      );
    }
  };

  // Navigate to the previous submodule
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSubmoduleId = submodules[currentIndex - 1].id;
      navigate(
        `/tcourse/${courseId}/modules/${moduleId}/submodules/${prevSubmoduleId}`
      );
    }
  };

  // 🔹 Upload to Cloudinary
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mimanuSubmodules"); // Cloudinary upload preset
    formData.append("folder", "mimanuSubmodules"); // Folder name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwnawhcfm/upload",
        formData
      );
      setFileUrl(response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return null;
    }
  };

  // 🔹 Save Updated Submodule Data
  const handleUpdate = async () => {
    if (!newTitle.trim()) return;

    let uploadedFileUrl = fileUrl; // Keep existing file if no new upload
    if (file) {
      uploadedFileUrl = await handleFileUpload(); // Upload file if selected
    }

    const updatedData = {
      SubmoduleTitle: newTitle,
      SubmoduleContent: newContent,
      fileUrl: uploadedFileUrl,
    };

    try {
      await updateSubmodule(courseId, moduleId, submoduleId, updatedData);
      setSubmodule({ ...submodule, ...updatedData });
      setIsEditing(false);
      toast.success("Submodule Updated Successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      toast.error(`${error}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }

    setIsEditing(false);
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
          {isEditing ? (
            <div className="flex flex-col gap-4">
              {/* Title Input */}
              <input
                type="text"
                className="text-2xl rounded w-full"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              {/* Show uploaded file if exists */}
              {fileUrl && (
                <div className="flex flex-col gap-4">
                  <p>Uploaded File:</p>
                  {fileUrl.includes(".png") ||
                  fileUrl.includes(".jpg") ||
                  fileUrl.includes(".jpeg") ? (
                    <img
                      src={fileUrl}
                      alt="Uploaded"
                      className="w-full h-98 object-cover"
                    />
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Document
                    </a>
                  )}
                </div>
              )}

              {/* File Upload */}
              <input
                type="file"
                className="w-68 px-4 py-2 rounded-lg shadow-y bg-white"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {/* Rich Text Editor */}
              <ReactQuill
                value={newContent}
                onChange={setNewContent}
                className="bg-white"
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className="bg-green-600 px-4 py-2 text-white rounded"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 px-4 py-2 text-white rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-2xl">{submodule?.SubmoduleTitle}</label>
                <button
                  className="bg-[#152852] px-8 py-2 cursor-pointer text-white rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Content
                </button>
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
            </div>
          )}
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

export default TSubmoduleScreen;
