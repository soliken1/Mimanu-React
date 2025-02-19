import React from "react";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchUser from "../../../hooks/get/fetchUser";
import LoadingScreen from "../../../components/LoadingScreen";
import CourseSidebar from "../../../components/CourseSidebar";
const CourseModules = ({ getUser, onLogout }) => {
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
      <div class="flex h-full w-full flex-col gap-5 px-8 py-8 md:px-24 md:py-16 md:mt-20">
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

            <div class="shadow-xy flex h-64 w-full flex-col overflow-y-auto rounded-xl px-8 py-6">
              <label class="font-semibold text-[#152852]">
                Topic 10: Leading Your Team
              </label>
              <div class="flex flex-col gap-2">
                <label class="cursor-pointer text-sm text-[#152852]">
                  10.1 Leading Your Team: Mastering the Art
                </label>
              </div>
            </div>
          </div>
          <div class="flex h-full w-full flex-col gap-5 md:w-9/12">
            <div class="shadow-xy flex flex-col gap-1 rounded-xl p-8">
              <label class="font-semibold text-[#152852]">Current Module</label>
              <label>
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
              <img
                class="mt-5 h-64 rounded-xl object-cover"
                src="/sample-module.png"
              />
            </div>
            <div class="flex h-full w-full items-center justify-end">
              <a
                class="flex flex-row gap-5"
                asp-action=""
                asp-area=""
                asp-controller=""
                asp-route-name=""
              >
                <label class="cursor-pointer text-[#152852]">Next</label>
                <img src="/right.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModules;
