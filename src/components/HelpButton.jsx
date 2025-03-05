import React from "react";
import { FaQuestion } from "react-icons/fa";
import { Link } from "react-router-dom";

const HelpButton = () => {
  return (
    <Link
      to="/help"
      className="fixed bottom-12 right-12 w-10 h-10 hover:bg-[#152852] duration-500 shadow-y rounded-full flex justify-center items-center text-white bg-red-700 cursor-pointer"
    >
      <FaQuestion />
    </Link>
  );
};

export default HelpButton;
