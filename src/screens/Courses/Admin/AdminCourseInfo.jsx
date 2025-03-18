import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import Loader from "../../../components/Loader";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
import updateCourse from "../../../hooks/update/updateCourse";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import AnnouncementModal from "../../../components/AddAnouncementModal";
import addAnnouncement from "../../../hooks/post/addAnnouncement";
import fetchAnnouncements from "../../../hooks/get/fetchAnnouncements";
import { IoMdArrowDropdown } from "react-icons/io";
import { GrAnnounce } from "react-icons/gr";
import { fetchAllTasks } from "../../../hooks/get/fetchTasks";
import { MdTask } from "react-icons/md";
import { Link } from "react-router-dom";
const AdminCourseInfo = ({ getUser }) => {
  const Screen = "Admin";
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [taskData, setTaskData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const announcement = await fetchAnnouncements(courseId);
        setAnnouncementsData(announcement);

        const tasks = await fetchAllTasks(courseId);
        console.log(tasks.availableTasks);
        setTaskData(tasks);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (courseData) {
      setNewTitle(courseData.CourseTitle || "");
      setNewDescription(courseData.CourseDescription || "");
      setNewContent(courseData.CourseContent || "");
      setFileUrl(courseData.fileUrl || "");
    }
  }, [courseData]);

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mimanuCourse"); // Cloudinary upload preset
    formData.append("folder", "mimanuCourse"); // Folder name

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
    if (!newTitle.trim()) return;

    let uploadedFileUrl = fileUrl; // Keep existing file if no new upload
    if (file) {
      uploadedFileUrl = await handleFileUpload(); // Upload file if selected
    }

    const updatedData = {
      CourseTitle: newTitle,
      CourseDescription: newDescription,
      fileUrl: uploadedFileUrl,
      CourseContent: newContent,
    };

    try {
      await updateCourse(courseId, updatedData);
      setCourseData({ ...courseData, ...updatedData });
      setIsEditing(false);
      toast.success("Course Updated Successfully!", {
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

  const handleAddAnnouncement = async (title, details) => {
    if (!title.trim() || !details.trim()) {
      toast.error("Title and details cannot be empty!", {
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      await addAnnouncement(courseId, title, details);
      setIsModalOpen(false);
      toast.success("Announcement added successfully!", {
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

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error("Failed to add announcement", {
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
    }
  };

  if (loading) {
    return <Loader />;
  }
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
          <CourseSidebar userData={userData} Screen={Screen} />
        </div>
        <div className="w-full h-full flex-flex-row mt-6">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              {/* Title Input */}
              <div>
                <label className=" text-sm">Edit Course Title:</label>
                <input
                  type="text"
                  className="text-2xl rounded w-full mb-4"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className=" text-sm">Edit Course Description:</label>
                <input
                  type="text"
                  className="text-2xl rounded w-full mb-4"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              {/* Show uploaded file if exists */}
              {fileUrl && (
                <div className="flex flex-col gap-4">
                  <p>Uploaded File:</p>
                  {fileUrl.includes(".png") ||
                  fileUrl.includes(".jpg") ||
                  fileUrl.includes(".webp") ||
                  fileUrl.includes(".jpeg") ? (
                    <img
                      src={fileUrl}
                      alt="Uploaded"
                      className="w-full h-60 object-cover"
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
              <div className="flex flex-col gap-2">
                <label className="text-sm">Add A File or Image:</label>
                <input
                  type="file"
                  className="w-68 px-4 py-2 rounded-lg shadow-y bg-white"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {/* Rich Text Editor */}
              <div className="flex flex-col mt-5 gap-2">
                <label className="text-sm">Add Body Content</label>
                <ReactQuill
                  value={newContent}
                  onChange={setNewContent}
                  className="bg-white"
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
            <div className="flex flex-col gap-4">
              <div className="flex justify-end items-center gap-5">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#152852] px-4 py-2 cursor-pointer text-white rounded"
                >
                  Create Announcement
                </button>
                <button
                  className="bg-[#152852] px-8 py-2 cursor-pointer text-white rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Content
                </button>
              </div>

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
                className="text-gray-800"
              />

              <div className="w-full mt-12 min-h-60 flex gap-5 flex-row h-auto">
                <div className="w-2/3 flex flex-col">
                  <div className="flex flex-row items-center gap-2 p-4 bg-gray-200 rounded-tl-lg rounded-tr-lg">
                    <IoMdArrowDropdown />
                    <label className="font-semibold">Announcements</label>
                  </div>
                  <div className="flex flex-row justify-between bg-gray-50">
                    {announcementsData.length === 0 ? (
                      <p className="text-gray-200">
                        No announcements available.
                      </p>
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
                                    <h3 className="text-lg font-semibold text-gray-800">
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
                <div className="w-1/3 flex flex-col rounded-lg">
                  <div className="flex flex-row items-center gap-2 py-4 p-4 bg-gray-200 rounded-tl-lg rounded-tr-lg">
                    <IoMdArrowDropdown />
                    <label className="font-semibold text-gray-600">
                      Available Tasks
                    </label>
                  </div>
                  <div className="flex flex-col">
                    {taskData.availableTasks.map((task) => (
                      <Link
                        to={`/acourse/${courseId}/tasks/${task.id}`}
                        key={task.id}
                        className="flex flex-row items-center gap-3 hover:bg-gray-300 px-4 py-3"
                      >
                        <MdTask />
                        <div className="flex flex-col text-sm">
                          <label className="cursor-pointer">
                            {task.TaskTitle}
                          </label>
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAnnouncement}
      />
      <ToastContainer />
    </div>
  );
};

export default AdminCourseInfo;
