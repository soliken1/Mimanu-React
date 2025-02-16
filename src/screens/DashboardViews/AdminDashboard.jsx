import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import Navbar from "../../components/Navbar";
const AdminDashboard = ({ getUser }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAndSetUserData();
  });
  return (
    <div className="flex h-full w-full flex-col gap-12 px-8 py-8 md:px-24">
      <Navbar userData={userData} />
      <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:mt-24">
        <label className="text-xl font-bold text-[#152852]">
          {`Welcome Back, ${userData?.Username}`}
        </label>
        <div className="relative w-full md:w-auto">
          <input
            className="shadow-xy border-0 w-full rounded-full px-8 py-2 md:w-96"
            placeholder="Find Tags, Course Titles, Employees"
          />
          <svg
            className="absolute right-4 top-2"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.88894 18.7779C14.7982 18.7779 18.7779 14.7982 18.7779 9.88894C18.7779 4.97971 14.7982 1 9.88894 1C4.97971 1 1 4.97971 1 9.88894C1 14.7982 4.97971 18.7779 9.88894 18.7779Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.9999 21.0004L16.1665 16.167"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col justify-evenly gap-5 md:flex-row">
        <div className="shadow-xy relative flex h-40 w-full flex-col justify-center gap-1 rounded-xl px-8 py-6 md:w-[400px]">
          <div className="flex flex-row items-center gap-12">
            <label className="text-6xl font-semibold">200</label>
            <div className="flex flex-row items-center justify-center gap-1 text-lg font-semibold">
              <label className="text-green-500">+100</label>
              <img className="h-[11px] w-[15px]" src="~/res/up_green.png" />
            </div>
          </div>
          <label className="text-xl">Total Number of Users</label>
          <svg
            className="absolute right-4 top-6"
            width="109"
            height="91"
            viewBox="0 0 109 91"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M77.4545 86.6363V77.4545C77.4545 72.5841 75.5198 67.9133 72.076 64.4694C68.6321 61.0256 63.9612 59.0908 59.0909 59.0908H22.3636C17.4933 59.0908 12.8224 61.0256 9.37858 64.4694C5.93473 67.9133 4 72.5841 4 77.4545V86.6363"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40.7272 40.7273C50.8691 40.7273 59.0908 32.5056 59.0908 22.3636C59.0908 12.2217 50.8691 4 40.7272 4C30.5852 4 22.3635 12.2217 22.3635 22.3636C22.3635 32.5056 30.5852 40.7273 40.7272 40.7273Z"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M105 86.6356V77.4538C104.997 73.385 103.643 69.4325 101.15 66.2167C98.6571 63.001 95.1669 60.7042 91.2273 59.687"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M72.8635 4.59619C76.8136 5.60757 80.3147 7.90486 82.815 11.1259C85.3152 14.3469 86.6723 18.3085 86.6723 22.386C86.6723 26.4635 85.3152 30.425 82.815 33.646C80.3147 36.8671 76.8136 39.1644 72.8635 40.1757"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="shadow-xy relative flex h-40 w-full flex-col justify-center gap-1 rounded-xl px-8 py-6 md:w-[400px]">
          <div className="flex flex-row items-center gap-12">
            <label className="text-6xl font-semibold">50</label>
            <div className="flex flex-row items-center justify-center gap-1 text-lg font-semibold">
              <label className="text-green-500">+10</label>
              <img className="h-[11px] w-[15px]" src="~/res/up_green.png" />
            </div>
          </div>
          <label className="text-xl">Total Number of Courses</label>
          <svg
            className="absolute right-4 top-6"
            width="86"
            height="102"
            viewBox="0 0 86 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 86.1683C3 83.0172 4.31696 79.9952 6.66117 77.767C9.00537 75.5389 12.1848 74.2871 15.5 74.2871H83"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 3H83V98.0495H15.5C12.1848 98.0495 9.00537 96.7977 6.66117 94.5696C4.31696 92.3414 3 89.3194 3 86.1683V14.8812C3 11.7301 4.31696 8.70807 6.66117 6.47992C9.00537 4.25176 12.1848 3 15.5 3Z"
              stroke="#BEBEBE"
              strokeOpacity="0.3"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold">Courses</label>
        <div className="flex flex-col flex-wrap justify-evenly gap-5 md:flex-row">
          <div className="shadow-xy relative flex h-52 w-full flex-col gap-1 rounded-xl bg-gradient-to-br from-blue-900 to-blue-500 px-8 py-4 md:w-[500px]">
            <label className="max-w-[200px] text-xl text-white">
              Leading at the Speed of Trust 4.0
            </label>
            <label className="text-gray-200">
              August 30 2024 - December 30 2024
            </label>
            <div className="mt-2 flex flex-row gap-4">
              <label className="rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
                Leadership
              </label>
              <label className="rounded-xl bg-gray-900 px-6 py-1 text-center text-white">
                Trust
              </label>
            </div>
            <img className="absolute bottom-4 right-4" src="~/res/People.png" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold">Users</label>
      </div>
      <div className="flex flex-row flex-wrap justify-evenly gap-5">
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
                Employee
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
