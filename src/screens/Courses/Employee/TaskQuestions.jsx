import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchQuestions from "../../../hooks/get/fetchQuestions";
import NavSidebar from "../../../components/NavSidebar";
import fetchUser from "../../../hooks/get/fetchUser";
import fetchTask from "../../../hooks/get/fetchTask";
import { Link } from "react-router-dom";
import submitAnswers from "../../../hooks/post/addAnswers";
import fetchEnrolled from "../../../hooks/get/fetchEnrolled";
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";

const EmployeeTaskQuestions = ({ getUser }) => {
  const navigate = useNavigate();
  const { courseId, taskId } = useParams();
  const [questionsData, setQuestionsData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskData, setTaskData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions = await fetchQuestions(courseId, taskId);
        setQuestionsData(questions);

        const task = await fetchTask(courseId, taskId);
        setTaskData(task);

        const user = await fetchUser(getUser.uid);
        setUserData(user);

        setLoading(false);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchData();
  }, [courseId, taskId]);

  const handleSubmit = async () => {
    if (!userData || !userData.UID) {
      console.error("User not found.");
      return;
    }

    // Fetch EnrolledId
    const enrolled = await fetchEnrolled(userData.UID, courseId);
    if (!enrolled) {
      toast.error("You Are Not Enrolled In This Course!", {
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
      return;
    }

    // Ensure questionsData is an array before passing it
    if (!Array.isArray(questionsData)) {
      console.error("questionsData is not an array!", questionsData);
      return;
    }

    // Submit answers
    const result = await submitAnswers(
      enrolled.id,
      answers,
      questionsData,
      taskId
    );

    if (result.success) {
      toast.success(
        `Submission Successful! Score: ${result.Score}/${result.TotalQuestions}`,
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
      setTimeout(() => {
        navigate(`/course/${courseId}/tasks`);
      }, 2000);
    } else {
      toast.error("Something Went Wrong!", {
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

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
  };

  const nextQuestion = () => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (questionsData.length === 0) {
    return (
      <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
        <NavSidebar userData={userData} />
        <div className="w-full flex flex-col gap-2 ps-66 h-auto min-h-screen p-12 bg-[#FAF9F6]"></div>
      </div>
    );
  }

  const currentQuestion = questionsData[currentIndex];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <label className="text-xl font-semibold text-center md:text-left">
          {taskData?.TaskTitle}
        </label>
        <div className="w-full md:flex-row flex-col flex gap-5 mt-5">
          {/* Sidebar */}
          <div className="min-w-[70px] bg-white rounded-lg md:min-h-52 overflow-y-auto p-4 h-full">
            <ul className="space-y-2">
              {questionsData.map((question, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-center p-1 rounded-lg cursor-pointer ${
                      currentIndex === index
                        ? "bg-[#152852] text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Question Area */}
          <div className="flex-1 flex-col flex justify-between">
            <div className="w-full h-auto p-8 bg-white min-h-52 rounded-xl">
              <div className="w-full flex justify-between text-xl mb-4">
                <p className="text-lg">
                  {currentIndex + 1}. {currentQuestion.Text}
                </p>
                <h2 className="text-gray-400 text-sm">
                  {currentIndex + 1} / {questionsData.length}
                </h2>
              </div>

              {/* Multiple Choice */}
              {currentQuestion.Type === "Multiple Choice" && (
                <ul className="flex gap-2 flex-col">
                  {currentQuestion.Options.map((option, index) => (
                    <li key={index}>
                      <label>
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() =>
                            handleAnswerChange(currentQuestion.id, option)
                          }
                        />{" "}
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {/* True or False */}
              {currentQuestion.Type === "True or False" && (
                <ul className="flex gap-2 flex-col">
                  {["True", "False"].map((option) => (
                    <li key={option}>
                      <label>
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() =>
                            handleAnswerChange(currentQuestion.id, option)
                          }
                        />{" "}
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {/* Identification */}
              {currentQuestion.Type === "Identification" && (
                <input
                  type="text"
                  className="border p-2 w-full mt-2"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="bg-[#152852] cursor-pointer text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={nextQuestion}
                  disabled={currentIndex === questionsData.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex pt-4 justify-between">
          <Link
            to={`/course/${courseId}/tasks/${taskId}`}
            className="px-4 py-2 rounded-md text-white bg-gray-400 "
          >
            Go Back
          </Link>
          <button
            onClick={handleSubmit}
            className="bg-[#152852] px-4 py-2 rounded-md text-white"
          >
            Submit
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeTaskQuestions;
