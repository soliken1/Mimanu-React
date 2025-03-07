import React, { useState } from "react";
import addQuestion from "../hooks/post/addQuestions";
import addTask from "../hooks/post/addTask";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
const AddQuestions = ({ step, setStep, taskData, onClose, courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "Multiple Choice",
    text: "",
    options: ["", ""], // Default 2 empty options
    answer: "",
  });

  // Add a new option for multiple-choice
  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });
  };

  // Update an option's value
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // Add question to list
  const addNewQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error("Enter Question Text!", {
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
    if (newQuestion.type === "Multiple Choice" && !newQuestion.answer) {
      toast.error("Select A Correct Answer!", {
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

    setQuestions([...questions, newQuestion]);

    setNewQuestion({
      Type: "Multiple Choice",
      Text: "",
      Options: ["", ""],
      Answer: "",
    });
  };

  // Save Task & Questions
  const handleFinish = async () => {
    if (questions.length === 0) {
      toast.error("Add Some Questions First!", {
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
    const taskId = await addTask(courseId, taskData);
    if (taskId) {
      for (const question of questions) {
        await addQuestion(courseId, taskId, question);
      }
      toast.success("Tasks and Questions Added Successfully!", {
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
        onClose();
      });
    } else {
      toast.error("Failed to save question!", {
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
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-lg font-bold mb-4">Add Questions</label>
      {/* Select Question Type */}
      <div className="flex flex-row gap-5">
        <div className="w-8/12 flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Question Type:</label>
            <select
              className="border rounded-lg px-4 py-2"
              value={newQuestion.type}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  type: e.target.value,
                  options: ["", ""],
                  answer: "",
                })
              }
            >
              <option>Multiple Choice</option>
              <option>True or False</option>
              <option>Identification</option>
            </select>
          </div>

          {/* Input for Question Text */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Question</label>
            <input
              type="text"
              placeholder="Question Text"
              className="border rounded-lg px-4 py-2"
              value={newQuestion.text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, text: e.target.value })
              }
            />
          </div>

          {/* Multiple Choice Options */}
          {newQuestion.type === "Multiple Choice" && (
            <>
              <div className="flex flex-col gap-2 max-h-48  overflow-y-auto">
                {newQuestion.options.map((option, index) => (
                  <div
                    className="flex flex-row gap-5 items-center text-sm"
                    key={index}
                  >
                    <input
                      type="text"
                      className="w-3/4 border border-gray-400 p-2 rounded-md"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                    <div className="w-1/4 flex flex-row gap-2 justify-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={option}
                        checked={newQuestion.answer === option}
                        onChange={() =>
                          setNewQuestion({ ...newQuestion, answer: option })
                        }
                      />
                      <label>Correct Answer</label>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="bg-green-600 py-2 rounded-md text-white"
                onClick={handleAddOption}
              >
                + Add Option
              </button>
            </>
          )}
          {/* True/False Question */}
          {newQuestion.type === "True or False" && (
            <div className=" flex justify-evenly">
              <label className="flex flex-row justify-center gap-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="True"
                  checked={newQuestion.answer === "True"}
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, answer: "True" })
                  }
                />
                True
              </label>
              <label className="flex flex-row justify-center gap-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="False"
                  checked={newQuestion.answer === "False"}
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, answer: "False" })
                  }
                />
                False
              </label>
            </div>
          )}
          {/* Identification Question */}
          {newQuestion.type === "Identification" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Correct Answer:</label>
              <input
                type="text"
                className="border rounded-lg px-4 py-2"
                placeholder="Correct Answer"
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, answer: e.target.value })
                }
              />
            </div>
          )}
        </div>
        <div className="w-4/12 overflow-y-auto">
          <label className="text-sm text-gray-600 mb-2">
            Added Questions:{" "}
          </label>
          <div className="  flex flex-col gap-2">
            {questions.map((q, index) => (
              <div
                className="text-xs flex flex-col gap-1 border-b pb-2 p-2 border-gray-200 hover:bg-gray-200"
                key={index}
              >
                <label>
                  {index + 1}. {q.text}{" "}
                </label>
                <label className="text-gray-600">
                  {q.answer && `Answer: ${q.answer}`} ({q.type})
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-4 border-t pt-4 border-gray-400">
        <button
          className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded"
          onClick={addNewQuestion}
        >
          Add Question
        </button>

        <div className="flex flex-row gap-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
          <button
            className="bg-[#152852] px-4 cursor-pointer text-white rounded-md"
            onClick={handleFinish}
          >
            Finish & Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddQuestions;
