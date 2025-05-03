import React from "react";
const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen relative bg-[#4580ff]">
      <div className="absolute flex-col flex justify-center items-center left-1/2 top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2">
        <img src="/book.png" className="w-32 h-32 object-cover" />
        <label className="text-2xl text-white font-semibold">Loading...</label>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center duration-100 animate-pulse -z-10 bg-[#091224]"></div>
    </div>
  );
};

export default LoadingScreen;
