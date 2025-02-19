import React from "react";
import CourseSidebar from "../../../components/CourseSidebar";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../components/LoadingScreen";
const ResultScreen = ({ getUser, onLogout }) => {
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
          <img class="-z-0 absolute bottom-4 right-4" src="~/res/People.png" />
        </div>

        <div class="flex h-full w-full flex-col gap-8 md:flex-row">
          <div class="flex h-full w-full flex-col gap-5 md:w-3/12">
            <div class="shadow-xy flex h-64 w-full flex-col rounded-xl py-6">
              <div class="px-8 font-semibold">
                <label class="text-[#152852]">Quick Actions</label>
              </div>
              <CourseSidebar />
            </div>
          </div>

          <div class="flex h-full w-full flex-col gap-8 md:w-9/12">
            <div class="flex h-full w-full flex-col gap-5 md:flex-row">
              <div class="flex h-full w-full flex-col md:w-3/5">
                <div class="shadow-xy h-full w-full rounded-xl px-8 pb-8">
                  <div class="flex">
                    <canvas id="resultBar" class="h-full w-full"></canvas>
                  </div>
                </div>
              </div>
              <div class="shadow-xy flex h-64 flex-col items-center justify-center rounded-xl md:w-2/5">
                <label class="text-6xl font-bold text-green-400">A+</label>
                <label class="mt-2 text-xl font-semibold text-[#152852]">
                  Result Status
                </label>
                <label class="text-lg text-[#152852]">
                  You're Doing Great!
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
