import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchSubmodule from "../../../hooks/get/fetchSubmodule";
import updateSubmodule from "../../../hooks/update/updateSubmodule";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
        setSubmodule(submoduleData);
        setNewTitle(submoduleData?.SubmoduleTitle || "");
        setNewContent(submoduleData?.SubmoduleContent || "");
        setFileUrl(submoduleData?.fileUrl || "");
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [courseId, moduleId, submoduleId]);

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

    await updateSubmodule(courseId, moduleId, submoduleId, updatedData);
    setSubmodule({ ...submodule, ...updatedData });
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
                  className="bg-[#152852] px-4 py-2 text-white rounded"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 px-4 py-2 text-white rounded"
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
      </div>
    </div>
  );
};

export default TSubmoduleScreen;
