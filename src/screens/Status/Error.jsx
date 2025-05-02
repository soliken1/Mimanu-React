import React from "react";

const Error = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <label className="text-6xl">Whoops... Something Went Wrong!</label>
      <label className="text-2xl text-red-500"></label>
    </div>
  );
};

export default Error;
