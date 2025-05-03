import React from "react";
import { MoonLoader } from "react-spinners";
const TopAnalyticsLoader = () => {
  return (
    <div className="md:w-1/4 w-52 flex flex-col h-32 p-6 shadow-y rounded-lg gap-2 animate-pulse duration-300 bg-white">
      <MoonLoader />
    </div>
  );
};

export default TopAnalyticsLoader;
