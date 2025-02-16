import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import fetchUser from "../../hooks/get/fetchUser";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
const EmployeeDashboardScreen = ({ getUser, onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        console.log(data);
        if (data.UserRole === "Admin") {
          navigate("/admindashboard");
        }
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
      <div className="flex h-full w-full flex-col px-8 py-8 md:px-24 md:mt-24">
        <label className="text-xl font-bold text-[#152852]">Your Tasks</label>
        <div className="mt-5 flex w-full justify-center">
          <div className="shadow-xy flex h-80 w-full flex-col items-center justify-center rounded-xl md:w-11/12">
            <img src="~/res/rocket.png" />
            <label className="text-xl">You've Completed All Your Tasks!</label>
            <label className="text-sm">
              Try Other Courses or Read Some Tips
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <div className="flex h-full w-full flex-col gap-4 md:w-9/12">
            <label className="text-xl font-bold text-[#152852]">
              Weekly Tips
            </label>
            <div className="flex flex-row flex-wrap justify-evenly gap-8">
              <div className="shadow-xy h-[275px] w-full rounded-xl md:w-[350px]">
                <div className="flex h-[110px] w-full items-center justify-center rounded-t-xl bg-rose-300">
                  <img className="h-20 w-20" src="~/res/sample_tip.png" />
                </div>
                <div className="flex flex-col px-6 py-4">
                  <label className="text-lg font-semibold">Test Yourself</label>
                  <label className="text-sm">
                    How would you tell a skeptical team about a change mandated
                    from above?
                  </label>
                  <div className="mt-5 flex flex-row items-center gap-3">
                    <label className="rounded-lg bg-rose-300 px-6 py-1 text-sm text-white">
                      Leading Change
                    </label>
                    <label className="text-xs text-gray-400">
                      ~7 Minute Read
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full w-full flex-col gap-4 md:w-3/12">
            <label className="text-xl font-bold text-[#152852]">
              Microcourses
            </label>
            <div className="shadow-xy flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl">
              <img src="~/res/sample_microcourse.png" />
              <label className="font-semibold">Persuading Others</label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label className="text-xl font-bold text-[#152852]">
            Verified Trainors
          </label>
        </div>
        <div className="mt-5 flex flex-row flex-wrap justify-evenly gap-5">
          <div className="shadow-xy relative flex h-[280px] w-full flex-col items-center gap-2 rounded-xl md:w-[300px]">
            <div className="h-1/3 w-full rounded-t-xl bg-gradient-to-b from-rose-300 to-rose-500"></div>
            <div className="absolute top-12 transform md:left-4 md:top-12 md:translate-x-2/3">
              <img
                src="~/res/SampleProfile.jpg"
                className="h-28 w-28 rounded-full"
              />
              <div className="flex flex-col items-center justify-center">
                <label className="text-xl font-semibold text-black">
                  EMP_kMacas
                </label>
                <label className="text-lg font-semibold text-gray-300">
                  Trainor
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardScreen;
