import React from "react";
import { BarLoader } from "react-spinners";
const TopAnalyticsLoader = ({ type }) => {
  return (
    <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 animate-pulse duration-300 bg-white">
      <label className="tracking-wider text-gray-400">{type}</label>
      <BarLoader />
    </div>
  );
};

export default TopAnalyticsLoader;
