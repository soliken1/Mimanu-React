import React, { useEffect, useState } from "react";
import formatDate from "../helper/formatDate";

const ProgressTable = ({ completedProgress, tasksData }) => {
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (!tasksData) return;

    // Combine all tasks into a single array
    const allTasks = [
      ...(tasksData.availableTasks || []),
      ...(tasksData.pastTasks || []),
      ...(tasksData.upcomingTasks || []),
    ];

    // Filter only answered tasks
    const answeredTasks = allTasks.filter(
      (task) => task.completedData?.Answered
    );

    // Sum total scores and total questions
    const totalScoreSum = answeredTasks.reduce(
      (sum, task) => sum + (task.completedData?.Score || 0),
      0
    );
    const totalQuestionsSum = answeredTasks.reduce(
      (sum, task) => sum + (task.completedData?.TotalQuestions || 0),
      0
    );

    setTotalScore(totalScoreSum);
    setTotalQuestions(totalQuestionsSum);
  }, [tasksData]);

  // Calculate percentage and pass/fail status
  const percentage =
    totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
  const passed = percentage >= 75; // Pass threshold

  return (
    <div className="w-full overflow-x-auto text-sm">
      <table className="min-w-full border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 font-light py-2">Title</th>
            <th className="px-4 font-light py-2">Completed</th>
            <th className="px-4 font-light py-2">Score</th>
            <th className="px-4 font-light py-2">Total</th>
            <th className="px-4 font-light py-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {completedProgress?.map((item, index) => {
            const isTask = item.type === "CompletedTask";
            const passThreshold = 0.75;
            const scorePercentage = isTask
              ? (item.Score / item.TotalQuestions) * 100
              : null;
            const passed = isTask
              ? scorePercentage >= passThreshold * 100
              : null;

            return (
              <tr key={index} className="border-gray-200 border-b">
                <td className="px-4 py-2">
                  {item.ModuleTitle || item.SubmoduleTitle || item.TaskTitle}
                </td>
                <td className="px-4 py-2">
                  {formatDate(item.CompletedAt.seconds)}
                </td>
                <td className="px-4 py-2">
                  {isTask ? `${scorePercentage.toFixed(2)}%` : ""}
                </td>
                <td className="px-4 py-2">
                  {isTask ? item.TotalQuestions : ""}
                </td>
                {isTask ? (
                  <td
                    className={`px-4 py-2 ${
                      totalScore === 0
                        ? "text-yellow-600"
                        : passed
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {totalScore === 0
                      ? "Pending"
                      : passed
                      ? "Passing"
                      : "Failing"}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Display total score, total questions, percentage, and pass/fail status */}
      <div className="w-full flex justify-end px-4 py-2 mt-2 text-sm">
        <div className="flex flex-row gap-6">
          <label className="text-gray-600">
            Score: {totalScore} / {totalQuestions} ({percentage.toFixed(2)}%)
          </label>
          <span
            className={`font-semibold ${
              totalScore === 0
                ? "text-yellow-600"
                : passed
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {totalScore === 0 ? "Pending" : passed ? "Passing" : "Failing"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTable;
