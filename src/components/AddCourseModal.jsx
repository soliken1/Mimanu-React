import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
import addCourse from "../hooks/post/addCourse";

const AddCourseModal = ({ isOpen, onClose }) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseEnd, setCourseEnd] = useState("");
  const [courseColor, setCourseColor] = useState("#fee685");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTags, setCourseTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!courseTags.includes(tagInput.trim())) {
        setCourseTags([...courseTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setCourseTags(courseTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveCourse = async () => {
    if (!courseTitle || !courseEnd) {
      toast.error("Please Input All The Required Fields", {
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
      return;
    }

    const result = await addCourse(
      courseTitle,
      courseEnd,
      courseColor,
      courseDescription,
      courseTags
    );

    if (result.success) {
      toast.success("Course Added Successfully!", {
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

      // Reset inputs
      setCourseTitle("");
      setCourseEnd("");
      setCourseColor("#fee685");
      setCourseDescription("");
      setCourseTags([]);

      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      console.error("Error adding course:", result.message);
      toast.error(`${result.message}`, {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3xl">
        <h2 className="text-xl font-semibold mb-4">Add Course</h2>

        <label className="block mb-2">Course Title</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Enter Course Title"
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Course Description</label>
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          placeholder="Enter Course Description"
          className="w-full border p-2 rounded mb-4"
        ></textarea>

        <label className="block mb-2">End Duration of the Course</label>
        <input
          type="date"
          value={courseEnd}
          onChange={(e) => setCourseEnd(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Color Picker Input */}
        <label className="block mb-2">Course Color</label>
        <input
          type="color"
          value={courseColor}
          onChange={(e) => setCourseColor(e.target.value)}
          className="w-full mb-4"
        />

        {/* Tags Input */}
        <label className="block mb-2">Course Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Press Enter to add a tag"
          className="w-full border p-2 rounded mb-2"
        />
        <div className="flex flex-wrap gap-2 mb-4">
          {courseTags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-white hover:text-gray-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSaveCourse}
            className="px-4 py-2 bg-[#152852] text-white rounded"
          >
            Save Course
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCourseModal;
