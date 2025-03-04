import React, { useEffect, useState } from "react";
import fetchUser from "../../hooks/get/fetchUser";
import NavSidebar from "../../components/NavSidebar";
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
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]"></div>
    </div>
  );
};

export default AdminDashboard;
