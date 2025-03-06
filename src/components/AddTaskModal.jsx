import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast, Bounce } from "react-toastify";
import addTask from "../hooks/post/addTask";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp

const AddTaskModal = ({ isOpen, onClose, courseId }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      toast.error("Task title cannot be empty!", { position: "bottom-right" });
      return;
    }
    if (!startDate) {
      toast.error("Please select a start date!", { position: "bottom-right" });
      return;
    }
    if (!endDate) {
      toast.error("Please select an end date!", { position: "bottom-right" });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after the end date!", {
        position: "bottom-right",
      });
      return;
    }

    const newTask = {
      TaskTitle: taskTitle,
      StartDate: Timestamp.fromDate(new Date(startDate)),
      EndDate: Timestamp.fromDate(new Date(endDate)),
      createdAt: Timestamp.now(),
    };

    try {
      const taskId = await addTask(courseId, newTask);
      if (taskId) {
        toast.success("Task Added Successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });

        // Reset fields after successful task creation
        setTaskTitle("");
        setStartDate("");
        setEndDate("");

        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 3000);
      }
    } catch (error) {
      toast.error("Failed To Add Task!", { position: "bottom-right" });
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <IoMdClose
          className="absolute top-3 right-3 text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
        <h2 className="text-lg font-bold mb-4">Add Task</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          placeholder="Enter Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-[#152852] text-white rounded"
            onClick={handleAddTask}
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

export default AddTaskModal;
