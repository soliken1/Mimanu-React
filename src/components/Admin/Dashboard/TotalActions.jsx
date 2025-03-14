import React from "react";
import { AiOutlineDash } from "react-icons/ai";
import { GoArrowUpRight } from "react-icons/go";

const TotalActions = ({ actionCountData }) => {
  return (
    <>
      <label className="tracking-wider text-gray-400">Total Actions</label>
      <div className="flex flex-row text-2xl gap-5 items-center">
        <label className="flex items-center gap-2">
          {actionCountData.totalActions}{" "}
          <label
            className={`text-sm ${
              actionCountData.change > 0 ? " text-green-600" : " text-gray-400"
            }`}
          >
            +{actionCountData.change}
          </label>
        </label>
        <div
          className={`text-sm px-2 rounded-sm flex items-center gap-2 flex-row ${
            actionCountData.change > 0
              ? "bg-green-200 text-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {actionCountData.change > 0 ? (
            <>
              <GoArrowUpRight />
              <label>{actionCountData.percentageChange}</label>
            </>
          ) : (
            <>
              <AiOutlineDash />
              <label>{actionCountData.percentageChange}</label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalActions;
