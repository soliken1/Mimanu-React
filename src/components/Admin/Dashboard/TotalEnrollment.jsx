import React from "react";
import { AiOutlineDash } from "react-icons/ai";
import { GoArrowUpRight } from "react-icons/go";
const TotalEnrollment = ({ enrollmentCountData }) => {
  return (
    <>
      <label className="tracking-wider text-gray-400">Total Enrollments</label>
      <div className="flex flex-row text-2xl gap-5 items-center">
        <label className="flex items-center gap-2">
          {enrollmentCountData.totalEnrolled}{" "}
          <label
            className={`text-sm ${
              enrollmentCountData.change > 0
                ? " text-green-600"
                : " text-gray-400"
            }`}
          >
            +{enrollmentCountData.change}
          </label>
        </label>
        <div
          className={`text-sm px-2 rounded-sm flex items-center gap-2 flex-row ${
            enrollmentCountData.change > 0
              ? "bg-green-200 text-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {enrollmentCountData.change > 0 ? (
            <>
              <GoArrowUpRight />
              <label>{enrollmentCountData.percentageChange}</label>
            </>
          ) : (
            <>
              <AiOutlineDash />
              <label>{enrollmentCountData.percentageChange}</label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalEnrollment;
