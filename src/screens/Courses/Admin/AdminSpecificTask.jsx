import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchTask from "../../../hooks/get/fetchTask";
import { ToastContainer } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import updateTask from "../../../hooks/update/updateTask";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { MdKeyboardArrowRight } from "react-icons/md";
import Loader from "../../../components/Loader";

const AdminSpecificTask = ({ getUser }) => {
  const { courseId, taskId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [embed, setEmbed] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);

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

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (task) {
      setNewTitle(task.TaskTitle || "");
      setNewContent(task.TaskContent || "");
      setFileUrl(task.fileUrl || "");
      setEmbed(task.EmbedURL || "");
    }
  }, [task]);

  // 🔹 Upload to Cloudinary
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mimanuTask");
    formData.append("folder", "mimanuTask");

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

  const handleUpdate = async () => {
    let uploadedFileUrl = fileUrl; // Keep existing file if no new upload
    if (file) {
      uploadedFileUrl = await handleFileUpload(); // Upload file if selected
    }

    const updatedData = {
      TaskTitle: newTitle,
      TaskContent: newContent,
      fileUrl: uploadedFileUrl,
      EmbedURL: embed.trim() ? embed : task?.EmbedURL || "",
    };

    try {
      await updateTask(courseId, taskId, updatedData);
      setTask({ ...task, ...updatedData });
      setIsEditing(false);
      toast.success("Task Updated Successfully!", {
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen md:p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col px-4 pt-12 md:px-0 md:pt-0">
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
              <div className="flex flex-col gap-1">
                <label className=" text-lg font-semibold">Edit Title:</label>
                <input
                  type="text"
                  className="text-sm border border-gray-400 py-2 px-4 rounded w-full mb-4 "
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              {/* Show uploaded file if exists */}
              {fileUrl && (
                <div className="flex flex-col">
                  <p className=" text-lg font-semibold">Uploaded File:</p>
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
              <div className="flex flex-col gap-2 mt-5">
                <label className=" text-lg font-semibold">
                  Add A File or Image:
                </label>
                <input
                  type="file"
                  className="w-68 px-4 py-2 text-sm rounded-lg shadow-y bg-white"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {/* Rich Text Editor */}
              <div className="flex flex-col mt-5 gap-2">
                <label className=" text-lg font-semibold">
                  Add Body Content:
                </label>
                <ReactQuill
                  value={newContent}
                  onChange={setNewContent}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col">
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
                <label className=" text-lg font-semibold mt-5">
                  Embed A Video:
                </label>
                <input
                  type="text"
                  className="text-sm px-4 py-2 border border-gray-400 w-1/2 rounded"
                  value={embed}
                  onChange={(e) => setEmbed(e.target.value)}
                />
              </div>

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
            <div className="flex flex-col gap-4 px-4 md:px-0 md:pt-0">
              <div className="flex justify-between items-center border-b border-gray-400 pb-4">
                <label className="text-2xl">{task?.TaskTitle}</label>
                <button
                  className="bg-[#152852] px-8 py-2 cursor-pointer text-white rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Content
                </button>
              </div>

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
                className="text-gray-800"
              />

              {task?.EmbedURL && (
                <iframe
                  className="md:w-1/2 w-full h-96"
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
                  to={`/acourse/${courseId}/tasks/${taskId}/questions`}
                  className="bg-[#152852] flex items-center px-4 py-2 rounded-md text-white"
                >
                  <label className="cursor-pointer">View Assignment</label>
                  <MdKeyboardArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminSpecificTask;
