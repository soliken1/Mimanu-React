import React from "react";
import Logo from "../assets/book.png";
const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center duration-300 animate-pulse bg-[#152852] bg-opacity-50">
      <img src={Logo} className="w-32 h-32 object-cover" />
      <label className="text-2xl text-white font-semibold">Loading...</label>
    </div>
  );
};

export default LoadingScreen;
