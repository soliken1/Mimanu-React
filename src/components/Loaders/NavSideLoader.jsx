import React from "react";

const NavSideLoader = () => {
  return (
    <div className="min-w-[28vh] max-w-[28vh] fixed h-screen flex-col md:flex hidden bg-gradient-to-b from-[#234faf] text-white to-[#152852]">
      <div className="h-32 w-full flex flex-row justify-center items-center gap-2">
        <img src="/book.png" className="h-16 w-16 drop-shadow-lg" />
        <label className="font-semibold">MiManuTMS</label>
      </div>
      <div className="flex-1 flex flex-col justify-between px-6">
        <div className="flex flex-col gap-4 animate-pulse duration-300 ">
          <div className="flex flex-row gap-2 w-full items-center">
            <div className="w-6 h-6 bg-[#152852] rounded-full"></div>
            <div className="bg-[#152852] w-20 h-2 rounded-full"></div>
          </div>
          <div className="flex flex-row gap-2 w-full items-center">
            <div className="w-6 h-6 bg-[#152852] rounded-full"></div>
            <div className="bg-[#152852] w-20 h-2 rounded-full"></div>
          </div>
          <div className="flex flex-row gap-2 w-full items-center">
            <div className="w-6 h-6 bg-[#152852] rounded-full"></div>
            <div className="bg-[#152852] w-20 h-2 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavSideLoader;
