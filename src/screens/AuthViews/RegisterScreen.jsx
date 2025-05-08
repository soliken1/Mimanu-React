import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import fetchUser from "../../hooks/get/fetchUser";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import RegisterModal from "../../components/RegisterModal";
import fetchUsers from "../../hooks/get/fetchUsers";
import NavSidebar from "../../components/NavSidebar";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import PeerFormModal from "../../components/PeerFormModal";
import Loader from "../../components/Loader";
import bcrypt from "bcryptjs";
import sendCredentials from "../../utils/sendCredentials";

const RegisterScreen = ({ getUser }) => {
  const navigate = useNavigate(); // Initialize useNavigate
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
  const [employeeUsers, setEmployeeUsers] = useState([]);
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
    const fetchData = async () => {
      try {
        const users = await fetchUsers();

        const employees = users.filter((user) => user.UserRole === "Employee");
        setEmployeeUsers(employees);

        setFilteredUsers(users);
        setUsers(users);

        const user = await fetchUser(getUser.uid);
        setUserData(user);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

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
      // Check if email already exists in Users collection
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("Email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Email already exists!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const newUserData = {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        UserRole: formData.role,
        Username: formData.username,
        Password: hashedPassword,
        UserImg:
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        CreatedAt: Timestamp.now(),
        isPending: true,
        Status: "Active",
      };

      await setDoc(doc(db, "Users", formData.email), newUserData);

      await sendCredentials({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        password: formData.password,
      });

      toast.success("User added successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });

      // Redirect and refresh to /register screen
      navigate("/register", { replace: true });
      window.location.reload(); // Reload to refresh the page

      // Clear form data after submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        username: "",
        Status: "",
      });
    } catch (error) {
      toast.error(`Failed to save user: ${error.message}`, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
      console.error(error);
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

  const handleDisableUser = async (uid) => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable this user?"
    );
    if (!confirmDisable) return;

    try {
      const userDocRef = doc(db, "Users", uid);
      await updateDoc(userDocRef, { Status: "Disabled" });
      alert("User has been disabled.");
      window.location.reload();
    } catch (error) {
      console.error("Error disabling user:", error);
      alert("Failed to disable user.");
    }
  };

  const handleReactivateUser = async (uid) => {
    const confirmDisable = window.confirm(
      "Are you sure you want to reactivate this user?"
    );
    if (!confirmDisable) return;

    try {
      const userDocRef = doc(db, "Users", uid);
      await updateDoc(userDocRef, { Status: "Active" });
      alert("User has been reactivated.");
      window.location.reload();
    } catch (error) {
      console.error("Error reactivating user:", error);
      alert("Failed to reactivate user.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="h-auto flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <label className="text-2xl font-semibold poppins-normal">
              Users
            </label>
            <label className="text-gray-500 poppins-normal">
              List of All Users on the Platform
            </label>
          </div>
          <div className="flex items-center mt-5 md:mt-0 md:justify-center">
            <button
              className="bg-[#152852] text-white hover:bg-[#0d1933] poppins-normal duration-300 flex flex-row gap-4 items-center px-6 py-2 rounded-lg shadow-xy-subtle"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus />
              Add User
            </button>
          </div>
        </div>
        <div className=" w-full flex flex-col gap-4 h-auto">
          <div className="w-full flex flex-col gap-4 h-auto mt-5">
            <label className="poppins-normal text-lg">
              All Users ({filteredUsers.length})
            </label>
            <div className="w-full h-auto flex-col md:flex-row flex justify-between">
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
              <div className="flex flex-col md:flex-row md:mt-0 mt-5 gap-5 md:items-center">
                <button
                  onClick={handlePeerFormClick}
                  className="text-xs bg-[#152852] px-4 py-3 text-white rounded-lg shadow-xy-subtle cursor-pointer"
                >
                  Send Forms
                </button>
                <div className="relative flex items-center p-1 bg-gray-200 rounded-xl">
                  <CiSearch className="absolute w-6 h-6 transform translate-x-2" />
                  <input
                    type="text"
                    placeholder="Search User"
                    className="bg-white px-10 py-2 md:w-auto w-full rounded-lg"
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
                  <Link
                    key={user.id}
                    to={`/profile/${user.UID}`}
                    className="flex justify-between bg-gray-100 cursor-pointer p-3 rounded-lg"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <img
                        src={user.UserImg}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <label className="text-sm cursor-pointer ">
                          {user.FirstName} {user.LastName}{" "}
                          <label
                            className={`px-2 cursor-pointer  rounded-xs ${
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
                        <label className="text-sm cursor-pointer text-gray-500">
                          @{user.Username}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center justify-center">
                      {user.UserRole === "Employee" && (
                        <>
                          <Link
                            to={`/form-answers/${user.UID}`}
                            className="text-xs underline cursor-pointer"
                          >
                            360 Assessment
                          </Link>
                        </>
                      )}
                      {user.Status != "Disabled" ||
                      user.Status === null ||
                      user.Status === undefined ||
                      !user.Status ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDisableUser(user.UID);
                          }}
                          className="text-red-500 cursor-pointer text-xs hover:underline"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleReactivateUser(user.UID);
                          }}
                          className="text-green-500 cursor-pointer text-xs hover:underline"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </Link>
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
        users={employeeUsers}
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
