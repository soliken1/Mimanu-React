import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import addSubmoduleToModule from "../hooks/post/addSubmodule";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
const AddSubmoduleModal = ({ isOpen, onClose, courseId, moduleId }) => {
  const [submoduleTitle, setSubmoduleTitle] = useState("");

  if (!isOpen) return null;

  const handleAddSubmodule = async () => {
    if (!submoduleTitle.trim()) {
      alert("Submodule title cannot be empty!");
      return;
    }

    const newSubmodule = {
      SubmoduleTitle: submoduleTitle,
      createdAt: new Date(),
    };

    const submoduleId = await addSubmoduleToModule(
      courseId,
      moduleId,
      newSubmodule
    );

    if (submoduleId) {
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
      setSubmoduleTitle("");
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 3000);
    } else {
      toast.error("Failed to add module", {
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
      console.error("Failed to add module");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <IoMdClose
          className="absolute top-3 right-3 text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
        <h2 className="text-lg font-bold mb-4">Add Submodule</h2>
        <input
          type="text"
          placeholder="Enter Submodule Title"
          value={submoduleTitle}
          onChange={(e) => setSubmoduleTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-[#152852] text-white rounded"
            onClick={handleAddSubmodule}
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

export default AddSubmoduleModal;
