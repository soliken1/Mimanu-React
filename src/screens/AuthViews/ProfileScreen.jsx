import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import fetchUser from "../../hooks/get/fetchUser";
import LoadingScreen from "../../components/LoadingScreen";
import { auth } from "../../config/firebaseConfigs";
import { signOut } from "firebase/auth";
const ProfileScreen = ({ getUser }) => {
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

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div class="flex h-full w-full flex-col md:flex-row">
      <Navbar userData={userData} />

      <div class="h-full w-full p-8 md:w-3/12 md:mt-24">
        <Sidebar />
      </div>

      <div class="flex h-full w-full flex-col gap-4 p-8 md:w-9/12 md:mt-24">
        <div class="border-b-2 border-b-red-500 py-2">
          <label class="w-full text-xl font-semibold text-[#152852]">
            User Profile
          </label>
        </div>

        <div class="flex h-full w-full flex-col gap-12 md:flex-row">
          <div class="order-2 h-full w-full md:w-2/3 md:order-1">
            <div class="flex flex-col gap-5">
              <div class="flex flex-col gap-1">
                <label class="text-[#152852]">Username</label>
                <label class="shadow-xy-subtle rounded-xl px-8 py-2 font-semibold text-[#152852]">
                  {userData.Username}
                </label>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[#152852]">First Name</label>
                <label class="shadow-xy-subtle rounded-xl px-8 py-2 font-semibold text-[#152852]">
                  {userData.FirstName}
                </label>
              </div>

              <div class="flex flex-col gap-1">
                <label>Last Name</label>
                <label class="shadow-xy-subtle rounded-xl px-8 py-2 font-semibold text-[#152852]">
                  {userData.LastName}
                </label>
              </div>

              <div class="flex flex-col gap-1">
                <label>Email</label>
                <label class="shadow-xy-subtle rounded-xl px-8 py-2 font-semibold text-[#152852]">
                  {userData.Email}
                </label>
              </div>

              <div class="flex flex-col gap-1">
                <label>Role</label>
                <label class="shadow-xy-subtle rounded-xl px-8 py-2 font-semibold text-[#152852]">
                  {userData.UserRole}
                </label>
              </div>

              <div class="mt-3 flex flex-row items-center justify-center gap-5">
                <Link
                  to="/editprofile"
                  class="rounded-xl bg-[#152852] px-6 py-2 text-white duration-300 hover:bg-[#0B162D]"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={logout}
                  class="rounded-xl cursor-pointer bg-[#DC3A3A] px-6 py-2 text-white duration-300 hover:bg-[#BE3030]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div class="order-1 flex h-full w-full md:mt-20 flex-col items-center justify-center gap-3 md:order-2 md:w-1/3">
            <img
              alt="Profile Picture"
              class="rounded-full object-cover w-40 h-40 shadow-md shadow-black"
              src={userData.UserImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
