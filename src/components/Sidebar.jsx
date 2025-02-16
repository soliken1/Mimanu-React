import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div class="shadow-xy flex h-40 w-full flex-col rounded-xl py-6 md:h-64">
      <div class="px-8 font-semibold">
        <label class="text-[#152852]">Accounts</label>
      </div>

      <Link
        to="/profile"
        class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg px-4"
      >
        <svg
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 12.25V11C11 10.337 10.7366 9.70107 10.2678 9.23223C9.79893 8.76339 9.16304 8.5 8.5 8.5H3.5C2.83696 8.5 2.20107 8.76339 1.73223 9.23223C1.26339 9.70107 1 10.337 1 11V12.25"
            stroke="#152852"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 6C7.38071 6 8.5 4.88071 8.5 3.5C8.5 2.11929 7.38071 1 6 1C4.61929 1 3.5 2.11929 3.5 3.5C3.5 4.88071 4.61929 6 6 6Z"
            stroke="#152852"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <label class="cursor-pointer text-[#152852]">User Profile</label>
      </Link>

      <Link
        to="/editprofile"
        class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg px-4"
      >
        <svg
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 12.25V11C11 10.337 10.7366 9.70107 10.2678 9.23223C9.79893 8.76339 9.16304 8.5 8.5 8.5H3.5C2.83696 8.5 2.20107 8.76339 1.73223 9.23223C1.26339 9.70107 1 10.337 1 11V12.25"
            stroke="#152852"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 6C7.38071 6 8.5 4.88071 8.5 3.5C8.5 2.11929 7.38071 1 6 1C4.61929 1 3.5 2.11929 3.5 3.5C3.5 4.88071 4.61929 6 6 6Z"
            stroke="#152852"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <label class="cursor-pointer text-[#152852]">Edit Profile</label>
      </Link>
    </div>
  );
};

export default Sidebar;
