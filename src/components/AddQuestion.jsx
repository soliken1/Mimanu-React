import React, { useState } from "react";
import addQuestion from "../hooks/post/addQuestions";
import addTask from "../hooks/post/addTask";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
const AddQuestions = ({ step, setStep, taskData, onClose, courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    Type: "Multiple Choice",
    Text: "",
    Options: ["", ""], // Default 2 empty options
    Answer: "",
  });

  // Add a new option for multiple-choice
  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, Options: [...newQuestion.Options, ""] });
  };

  // Update an option's value
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.Options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, Options: updatedOptions });
  };

  // Add question to list
  const addNewQuestion = () => {
    if (!newQuestion.Text.trim()) {
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
    if (newQuestion.Type === "Multiple Choice" && !newQuestion.Answer) {
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
              value={newQuestion.Type}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  Type: e.target.value,
                  Options: ["", ""],
                  Answer: "",
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
              value={newQuestion.Text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, Text: e.target.value })
              }
            />
          </div>

          {/* Multiple Choice Options */}
          {newQuestion.Type === "Multiple Choice" && (
            <>
              <div className="flex flex-col gap-2 max-h-48  overflow-y-auto">
                {newQuestion.Options.map((option, index) => (
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
                        value={index} // Store the index instead of value
                        checked={
                          newQuestion.Answer === newQuestion.Options[index]
                        }
                        onChange={() =>
                          setNewQuestion({
                            ...newQuestion,
                            Answer: newQuestion.Options[index],
                          })
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
          {newQuestion.Type === "True or False" && (
            <div className=" flex justify-evenly">
              <label className="flex flex-row justify-center gap-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="True"
                  checked={newQuestion.Answer === "True"}
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, Answer: "True" })
                  }
                />
                True
              </label>
              <label className="flex flex-row justify-center gap-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="False"
                  checked={newQuestion.Answer === "False"}
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, Answer: "False" })
                  }
                />
                False
              </label>
            </div>
          )}
          {/* Identification Question */}
          {newQuestion.Type === "Identification" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Correct Answer:</label>
              <input
                type="text"
                className="border rounded-lg px-4 py-2"
                placeholder="Correct Answer"
                value={newQuestion.Answer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, Answer: e.target.value })
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
                  {index + 1}. {q.Text}{" "}
                </label>
                <label className="text-gray-600">
                  {q.Answer && `Answer: ${q.Answer}`} ({q.Type})
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
