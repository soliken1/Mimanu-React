import CourseSidebar from "../../../components/CourseSidebar";
import React from "react";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../components/LoadingScreen";

const CourseInfo = ({ getUser, onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setLoading(false);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="w-auto h-auto relative">
      <Navbar userData={userData} />

      <div class="flex h-full w-full flex-col gap-5 overflow-y-auto px-8 py-8 md:px-24 md:py-16 md:mt-20">
        <div class="shadow-xy relative flex h-full w-full flex-col gap-3 rounded-xl bg-gradient-to-br from-blue-900 to-blue-500 px-8 py-8 md:py-4 md:h-56">
          <label class="max-w-[400px] text-xl text-white">
            Leading at the Speed of Trust 4.0
          </label>
          <label class="max-w-[800px] text-sm text-white">
            Involves essential strategies like setting a clear vision,
            encouraging open communication, fostering collaboration, and
            empowering team members to achieve goals effectively.
          </label>
          <label class="text-xs font-extralight text-gray-300">
            August 30 2024 - December 30 2024
          </label>
          <div class="mt-2 flex flex-row gap-4">
            <label class="z-0 rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
              Leadership
            </label>
            <label class="z-0 rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
              Trust
            </label>
          </div>
          <img class="-z-0 absolute bottom-4 right-4" src="/People.png" />
        </div>

        <div class="flex h-full w-full flex-col gap-8 md:flex-row">
          <div class="flex h-full w-full flex-col gap-5 md:w-3/12">
            <div class="shadow-xy flex h-64 w-full flex-col rounded-xl py-6">
              <div class="px-8 font-semibold">
                <label class="text-[#152852]">Quick Actions</label>
              </div>

              <CourseSidebar />
            </div>

            <div class="shadow-xy flex h-72 w-full flex-col items-center justify-center gap-2 rounded-xl p-8">
              <label class="text-lg font-semibold text-[#152852]">
                Progress Status
              </label>
              <canvas class="h-full w-full" id="donutProgress"></canvas>
            </div>
          </div>

          <div class="flex h-full w-full flex-col gap-8 md:w-9/12">
            <div class="shadow-xy flex h-full w-full flex-col gap-3 rounded-xl p-5 md:h-60">
              <label class="text-lg font-semibold text-[#152852]">
                Current Module
              </label>
              <label class="text-[#152852]">
                10.5 Leading Your Team: Critical Practices for Success
              </label>
              <label class="text-[#152852]">
                This topic covers essential practices for effective team
                leadership, including setting a clear vision, fostering open
                communication, promoting teamwork, empowering individuals, and
                providing constructive feedback. Mastering these practices
                enables leaders to build a positive work environment, boost team
                morale, and drive high performance.
              </label>
              <div class="flex h-1/6 w-full items-center justify-end">
                <div class="flex flex-row items-center justify-center">
                  <button class="px-6 text-center text-lg font-semibold text-[#152852]">
                    Continue
                  </button>
                  <svg
                    width="7"
                    height="10"
                    viewBox="0 0 7 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 8.825L3.825 5L0 1.175L1.18333 0L6.18333 5L1.18333 10L0 8.825Z"
                      fill="#152852"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex h-full w-full flex-col gap-5 md:flex-row">
              <div class="flex h-full w-full flex-col p-5 md:w-2/4">
                <div class="flex w-full flex-row items-center justify-between">
                  <label class="text-xl font-semibold text-[#152852]">
                    Result Summary
                  </label>
                  <label class="text-4xl font-semibold text-green-400">
                    A+
                  </label>
                </div>
                <div class="h-full w-full">
                  <div class="flex justify-center">
                    <canvas id="resultBar" class="h-full w-full"></canvas>
                  </div>
                </div>
              </div>
              <div class="flex h-full w-full flex-col gap-5 p-5 md:w-2/4">
                <label class="text-xl font-semibold text-[#152852]">
                  Recent Tasks
                </label>
                <div class="flex flex-row items-center justify-center gap-5">
                  <img src="/confetti.png" class="h-16 w-16" />
                  <label class="max-w-[200px] text-center text-lg text-[#152852]">
                    You Have No Tasks Currently!
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
