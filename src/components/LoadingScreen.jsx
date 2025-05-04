import React from "react";
import { MoonLoader } from "react-spinners";
const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen relative bg-[#4580ff]">
      <div className="absolute flex-col flex justify-center items-center left-1/2 top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2">
        <MoonLoader color="white" />
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center duration-100 animate-pulse -z-10 bg-[#091224]"></div>
    </div>
  );
};

export default LoadingScreen;
