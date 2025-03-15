import React from "react";
import { AiOutlineDash } from "react-icons/ai";
import { GoArrowUpRight } from "react-icons/go";
const TotalCourse = ({ courseCountData }) => {
  return (
    <>
      <label className="tracking-wider text-gray-400">TOTAL COURSES</label>
      <div className="flex flex-row text-2xl gap-5 items-center">
        <label className="flex items-center gap-2">
          {courseCountData.totalCourses}{" "}
          <label
            className={`text-sm ${
              courseCountData.newCourses > 0
                ? " text-green-600"
                : " text-gray-400"
            }`}
          >
            +{courseCountData.newCourses}
          </label>
        </label>
        <div
          className={`text-sm px-2 rounded-sm flex items-center gap-2 flex-row ${
            courseCountData.newCourses > 0
              ? "bg-green-200 text-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {courseCountData.newCourses > 0 ? (
            <>
              <GoArrowUpRight />
              <label>{courseCountData.percentageChange}</label>
            </>
          ) : (
            <>
              <AiOutlineDash />
              <label>{courseCountData.percentageChange}</label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalCourse;
