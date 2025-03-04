import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import fetchUser from "../../hooks/get/fetchUser";
import LoadingScreen from "../../components/LoadingScreen";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs";
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import RegisterModal from "../../components/RegisterModal";
import fetchUsers from "../../hooks/get/fetchUsers";
import NavSidebar from "../../components/NavSidebar";
import { Link } from "react-router-dom";
import PeerFormModal from "../../components/PeerFormModal";
const RegisterScreen = ({ getUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isPeerModalOpen, setIsPeerModalOpen] = useState(false);
  const [selectedPeers, setSelectedPeers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "firstName" || name === "lastName" || name === "role") {
        updatedData.username = generateUsername(
          updatedData.firstName,
          updatedData.lastName,
          updatedData.role
        );
      }
      return updatedData;
    });
  };

  const handlePeerFormClick = () => {
    setIsPeerModalOpen(true);
  };

  const generateUsername = (firstName, lastName, role) => {
    if (!firstName || !lastName || !role) return "";
    const rolePrefix = role === "Trainor" ? "TRA" : "EMP";
    const firstInitial = firstName.charAt(0).toLowerCase();

    const uniqueNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = uniqueNumber.toString().padStart(4, "0");

    return `${rolePrefix}${formattedNumber}_${firstInitial}${lastName}`;
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const data = await fetchUsers();
      setFilteredUsers(data);
      setUsers(data);
    };
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setLoading(false);
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAllUsers();
    fetchAndSetUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const userDoc = {
        UID: user.uid,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        UserRole: formData.role,
        Username: formData.username,
        UserImg:
          "https://res.cloudinary.com/dip5gm9sj/image/upload/v1738510538/profile_images/osnoqwziewk117iq51pw.jpg",
      };

      await setDoc(doc(db, "Users", user.uid), userDoc);
      toast.success("Successfully Registered User", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        username: "",
      });
    } catch (error) {
      toast.error(`Something went Wrong! Please Try Again ${error}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        username: "",
      });
      console.error(error.message);
    }
  };

  const handleFilter = (role) => {
    setSelectedRole(role);
    if (role === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.UserRole === role));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.Username.toLowerCase().includes(query) ||
          user.FirstName.toLowerCase().includes(query) ||
          user.LastName.toLowerCase().includes(query)
      )
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="h-auto flex flex-row justify-between">
          <div className="flex flex-col">
            <label className="text-2xl font-semibold poppins-normal">
              Users
            </label>
            <label className="text-gray-500 poppins-normal">
              List of All Users on the Platform
            </label>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-[#152852] text-white hover:bg-[#0d1933] poppins-normal duration-300 flex flex-row gap-4 items-center px-6 py-2 rounded-lg shadow-xy-subtle"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus />
              Add User
            </button>
          </div>
        </div>
        <div className=" w-full flex flex-col gap-4 h-auto mt-5">
          <div className="w-full flex flex-col gap-4 h-auto mt-5">
            <label className="poppins-normal text-lg">
              All Users ({filteredUsers.length})
            </label>
            <div className="w-full h-auto flex justify-between">
              {/* Role Filter Buttons */}
              <div className="p-1 flex flex-row gap-2 bg-gray-200 rounded-md">
                {["All", "Employee", "Trainor", "Admin"].map((role) => (
                  <button
                    key={role}
                    className={`px-2 py-1 rounded-lg ${
                      selectedRole === role
                        ? "bg-white text-black"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleFilter(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {/* Search Bar */}
              <div className="flex flex-row gap-5 items-center">
                <button
                  onClick={handlePeerFormClick}
                  className="text-xs bg-[#152852] px-4 py-2 text-white rounded-lg shadow-xy-subtle cursor-pointer"
                >
                  Peer Form
                </button>
                <div className="relative flex items-center p-1 bg-gray-200 rounded-xl">
                  <CiSearch className="absolute w-6 h-6 transform translate-x-2" />
                  <input
                    type="text"
                    placeholder="Search User"
                    className="bg-white px-10 py-2 rounded-lg"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            {/* User List */}
            <div className="flex flex-col gap-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between bg-gray-100 p-3 rounded-lg"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <img
                        src={user.UserImg}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <label className="text-sm">
                          {user.FirstName} {user.LastName}{" "}
                          <label
                            className={`px-2  rounded-xs ${
                              user.UserRole === "Admin"
                                ? "bg-red-200"
                                : user.UserRole === "Trainor"
                                ? "bg-amber-200"
                                : "bg-sky-200"
                            }`}
                          >
                            {user.UserRole}
                          </label>
                        </label>
                        <label className="text-sm text-gray-500">
                          @{user.Username}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center justify-center">
                      {/*Add Extra Params on URL Maybe For UserID Referencing e.g /mbti-form?id=user.id*/}
                      <Link className="text-xs cursor-pointer" to="/mbti-form">
                        MBTI Form
                      </Link>
                      <button className="text-red-500 cursor-pointer text-xs hover:underline">
                        Disable
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-3">No users found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <PeerFormModal
        isOpen={isPeerModalOpen}
        onClose={() => setIsPeerModalOpen(false)}
        users={users}
        selectedPeers={selectedPeers}
        setSelectedPeers={setSelectedPeers}
      />

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
      />
      <ToastContainer />
    </div>
  );
};

export default RegisterScreen;
