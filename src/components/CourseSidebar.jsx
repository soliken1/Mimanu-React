import React from "react";

const CourseSidebar = () => {
  return (
    <>
      <div class="flex flex-col">
        <a>
          <div class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4.85L5.95 1L10.9 4.85V10.9C10.9 11.1917 10.7841 11.4715 10.5778 11.6778C10.3715 11.8841 10.0917 12 9.8 12H2.1C1.80826 12 1.52847 11.8841 1.32218 11.6778C1.11589 11.4715 1 11.1917 1 10.9V4.85Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.30005 12V6.5H7.60005V12"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label class="cursor-pointer text-sm text-[#152852]">Home</label>
          </div>
        </a>

        <a>
          <div class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lgpx-4">
            <svg
              width="11"
              height="13"
              viewBox="0 0 11 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 10.625C1 10.2603 1.14487 9.91059 1.40273 9.65273C1.66059 9.39487 2.01033 9.25 2.375 9.25H9.8"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.375 1H9.8V12H2.375C2.01033 12 1.66059 11.8551 1.40273 11.5973C1.14487 11.3394 1 10.9897 1 10.625V2.375C1 2.01033 1.14487 1.66059 1.40273 1.40273C1.66059 1.14487 2.01033 1 2.375 1Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label class="cursor-pointer text-sm text-[#152852]">Modules</label>
          </div>
        </a>

        <a>
          <div class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg px-4">
            <svg
              width="11"
              height="13"
              viewBox="0 0 11 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 1H2.1C1.80826 1 1.52847 1.11589 1.32218 1.32218C1.11589 1.52847 1 1.80826 1 2.1V10.9C1 11.1917 1.11589 11.4715 1.32218 11.6778C1.52847 11.8841 1.80826 12 2.1 12H8.7C8.99174 12 9.27153 11.8841 9.47782 11.6778C9.68411 11.4715 9.8 11.1917 9.8 10.9V4.3L6.5 1Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 1V4.3H9.8"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.59995 7.04999H3.19995"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.59995 9.25H3.19995"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.29995 4.84998H3.74995H3.19995"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label class="cursor-pointer text-sm text-[#152852]">Tasks</label>
          </div>
        </a>

        <a>
          <div class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg px-4">
            <svg
              width="10"
              height="13"
              viewBox="0 0 10 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.25 12V5.125"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.125 12V1"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 12V7.875"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label class="cursor-pointer text-sm text-[#152852]">Result</label>
          </div>
        </a>
      </div>
      <div class="flex-1 mt-5 flex items-end justify-end px-4">
        <a
          class="flex flex-row items-center gap-2"
          asp-area=""
          asp-controller="Courses"
          asp-action="Course"
        >
          <img src="~/res/left.svg" />
          <label class="cursor-pointer text-sm font-semibold text-[#152852]">
            Back To Courses
          </label>
        </a>
      </div>
    </>
  );
};

export default CourseSidebar;
