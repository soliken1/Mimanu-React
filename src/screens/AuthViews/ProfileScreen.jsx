import React, { useEffect, useState } from "react";
import NavSidebar from "../../components/NavSidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchUser from "../../hooks/get/fetchUser";
import LoadingScreen from "../../components/LoadingScreen";
import { auth } from "../../config/firebaseConfigs";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import HelpButton from "../../components/HelpButton";
const ProfileScreen = ({ getUser }) => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const selectedData = await fetchUser(uid);
        setSelectedUser(selectedData);

        const data = await fetchUser(getUser.uid);
        setUserData(data);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetUserData();
  }, [uid]);

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="h-60 relative bg-amber-100 rounded-lg">
          <div className="w-full justify-between flex flex-row h-auto absolute gap-1 pe-20 bottom-0 left-0 transform translate-x-8 translate-y-28">
            <div className="flex flex-row">
              <img
                className="w-48 h-48 p-1 bg-white rounded-full object-cover"
                src={selectedUser?.UserImg}
              />
              <div className="min-h-full flex items-end">
                <div className="flex flex-col">
                  <label className="text-2xl font-semibold">
                    {selectedUser?.FirstName} {selectedUser?.LastName}
                  </label>
                  <label className="text-lg text-gray-600">
                    @{selectedUser?.Username}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 h-auto min-h-96 text-gray-500 justify-center items-center flex">
          Display Maybe Achievements Here
        </div>
      </div>
      <HelpButton />
    </div>
  );
};

export default ProfileScreen;
