import React from "react";

const CourseProgress = ({ totalCompletion, totalCourseProgress }) => {
  // Calculate progress percentage
  const progressPercentage =
    totalCompletion > 0 ? (totalCompletion / totalCourseProgress) * 100 : 0;

  return (
    <div className="p-4 shadow-md rounded-lg">
      <label className="block text-gray-700 font-semibold mb-2">
        Course Progress:
      </label>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <label className="block text-gray-600 text-sm mt-2">
        {totalCompletion} out of {totalCourseProgress} Course Progress
      </label>
    </div>
  );
};

export default CourseProgress;
