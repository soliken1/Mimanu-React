import React from "react";
import { AiOutlineDash } from "react-icons/ai";
import { GoArrowUpRight } from "react-icons/go";
const TotalEmployee = ({ userCountData }) => {
  return (
    <>
      <label className="tracking-wider text-gray-400">TOTAL EMPLOYEES</label>
      <div className="flex flex-row text-2xl gap-5 items-center">
        <label className="flex items-center gap-2">
          {userCountData.totalUsers}{" "}
          <label
            className={`text-sm ${
              userCountData.newUsers > 0 ? " text-green-600" : " text-gray-400"
            }`}
          >
            +{userCountData.newUsers}
          </label>
        </label>
        <div
          className={`text-sm px-2 rounded-sm flex items-center gap-2 flex-row ${
            userCountData.newUsers > 0
              ? "bg-green-200 text-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {userCountData.newUsers > 0 ? (
            <>
              <GoArrowUpRight />
              <label>{userCountData.percentageChange}</label>
            </>
          ) : (
            <>
              <AiOutlineDash />
              <label>{userCountData.percentageChange}</label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalEmployee;
