import React, { useState } from "react";
import { useParams } from "react-router-dom"; // To get courseId from URL
import addModuleToCourse from "../hooks/post/addModule"; // Import function
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";

const AddModuleModal = ({ isOpen, onClose }) => {
  const { courseId } = useParams(); // Get courseId from URL
  const [ModuleTitle, setModuleTitle] = useState("");

  if (!isOpen) return null;

  const handleAddModule = async () => {
    if (!ModuleTitle.trim()) {
      alert("Module title cannot be empty.");
      return;
    }

    try {
      await addModuleToCourse(courseId, {
        ModuleTitle,
        createdAt: new Date(),
      });

      toast.success("Module Added Successfully!", {
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
      setModuleTitle(""); // Clear input after adding
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 3000);
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
      console.error("Failed to add module:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Add Module</h2>
        <input
          type="text"
          placeholder="Add A Title"
          className="w-full p-2 border rounded mb-3"
          value={ModuleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-[#152852] text-white rounded"
            onClick={handleAddModule}
          >
            Add
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddModuleModal;
