import React from "react";

const Loader = () => {
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
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
        <div className="pb-20 flex flex-col gap-4 px-6 animate-pulse duration-300 ">
          <div className="flex flex-row gap-2 items-center w-full">
            <div className="w-6 h-6 bg-[#152852] rounded-full"></div>
            <div className="bg-[#152852] w-20 h-2 rounded-full"></div>
          </div>
          <div className="flex flex-row gap-2 items-center w-full border-b pb-4 border-white">
            <div className="w-6 h-6 bg-[#152852] rounded-full"></div>
            <div className="bg-[#152852] w-20 h-2 rounded-full"></div>
          </div>
          <div className=" min-w-full w-auto px-4 flex flex-row rounded-xl duration-100 items-center gap-4 bg-[#152852]  h-16">
            <div className="w-10 h-10 object-cover bg-[#0c1830]  rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-nowrap cursor-pointer w-20 h-2 rounded-full bg-[#0c1830]"></div>
              <div className="w-12 h-2 rounded-full bg-[#0c1830]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <div className="w-32 h-4 rounded-full animate-pulse bg-[#152852]"></div>
            <div className="w-64 h-4 rounded-full animate-pulse bg-[#152852]"></div>
          </div>
        </div>
        <div className="w-full h-52 rounded-lg flex-flex-row mt-6 animate-pulse bg-gray-200 shadow-y"></div>
      </div>
    </div>
  );
};

export default Loader;
