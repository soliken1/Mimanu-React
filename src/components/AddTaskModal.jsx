import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import AddQuestions from "./AddQuestion";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
const AddTaskModal = ({ isOpen, onClose, courseId }) => {
  const [step, setStep] = useState(1);
  const [taskData, setTaskData] = useState({
    TaskTitle: "",
    StartDate: "",
    EndDate: "",
    TaskDescription: "",
    Enabled: true,
  });

  const handleNext = () => {
    if (
      !taskData.TaskTitle.trim() ||
      !taskData.StartDate ||
      !taskData.EndDate
    ) {
      toast.error("Please Fill Out The Task Details!", {
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
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg duration-200 ${
          step === 2 ? "w-[1000px]" : "w-[500px]"
        } relative`}
      >
        <IoMdClose
          className="absolute top-3 right-3 text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
        {step === 1 ? (
          <>
            <label className="text-lg font-bold mb-4">Add Task</label>
            <label className="block text-sm font-medium text-gray-700 mt-5 mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              value={taskData.TaskTitle}
              onChange={(e) =>
                setTaskData({ ...taskData, TaskTitle: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <input
              type="text"
              placeholder="Enter Task Description"
              value={taskData.TaskDescription}
              onChange={(e) =>
                setTaskData({ ...taskData, TaskDescription: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={taskData.StartDate}
              onChange={(e) =>
                setTaskData({ ...taskData, StartDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={taskData.EndDate}
              onChange={(e) =>
                setTaskData({ ...taskData, EndDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end gap-2 text-white mt-4">
              <button
                className="bg-[#152852] px-4 cursor-pointer rounded-md"
                onClick={handleNext}
              >
                Next →
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <AddQuestions
            step={step}
            setStep={setStep}
            taskData={taskData}
            onClose={onClose}
            courseId={courseId}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddTaskModal;
