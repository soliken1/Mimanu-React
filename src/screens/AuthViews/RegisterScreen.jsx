import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import fetchUser from "../../hooks/get/fetchUser";
import LoadingScreen from "../../components/LoadingScreen";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs";
const RegisterScreen = ({ getUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
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

  const generateUsername = (firstName, lastName, role) => {
    if (!firstName || !lastName || !role) return "";
    const rolePrefix = role === "Trainor" ? "TRA" : "EMP";
    const firstInitial = firstName.charAt(0).toLowerCase();
    return `${rolePrefix}_${firstInitial}${lastName}`;
  };

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
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20">
      <Navbar userData={userData} />
      <div class="h-full w-full p-8 md:w-3/12 md:mt-24">
        <div class="shadow-xy flex h-32 w-full flex-col rounded-xl py-6 md:h-64">
          <div class="px-8 font-semibold">
            <label class="text-[#152852]">Accounts</label>
          </div>

          <div class="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg border-[#DC3A3A] bg-gray-100 px-4">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 12.25V11C11 10.337 10.7366 9.70107 10.2678 9.23223C9.79893 8.76339 9.16304 8.5 8.5 8.5H3.5C2.83696 8.5 2.20107 8.76339 1.73223 9.23223C1.26339 9.70107 1 10.337 1 11V12.25"
                stroke="#152852"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6C7.38071 6 8.5 4.88071 8.5 3.5C8.5 2.11929 7.38071 1 6 1C4.61929 1 3.5 2.11929 3.5 3.5C3.5 4.88071 4.61929 6 6 6Z"
                stroke="#152852"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label class="text-[#152852]">Account Creation</label>
          </div>
        </div>
      </div>
      <div class="flex h-full w-full flex-col gap-4 p-8 md:w-9/12 md:mt-24">
        <div class="border-b-2 border-b-red-500 py-2">
          <label class="w-full text-xl font-semibold text-[#152852]">
            Register User
          </label>
        </div>

        <form class="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div class="flex w-full flex-col gap-1">
            <label class="text-[#152852]"></label>
            <input
              name="username"
              placeholder="EMP_jDoe"
              readonly={true}
              value={formData.username}
              class="w-full rounded-xl px-4 py-2 border border-black"
              disabled={true}
            />
            <label class="text-xs">
              This is displayed throughout the public within the website instead
              of your full name.
            </label>
          </div>

          <div class="flex w-full flex-row gap-5">
            <div class="flex w-1/2 flex-col gap-1">
              <label class="text-[#152852]">First Name</label>
              <input
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                class="rounded-xl px-4 py-2 border border-black"
              />
            </div>

            <div class="flex w-1/2 flex-col gap-1">
              <label class="text-[#152852]">Last Name</label>
              <input
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                class="rounded-xl px-4 py-2 border border-black"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#152852]">Role</label>
            <div className="flex flex-row gap-4">
              <label className="flex flex-row items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Trainor"
                  placeholder="Trainor"
                  onChange={handleChange}
                  checked={formData.role === "Trainor"}
                />
                Trainor
              </label>
              <label className="flex flex-row items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Employee"
                  onChange={handleChange}
                  checked={formData.role === "Employee"}
                />
                Employee
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#152852]">Email</label>
            <input
              name="email"
              type="email"
              placeholder="sampleemail@example.com"
              className="rounded-xl px-4 py-2 border border-black"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div class="flex w-full flex-row gap-5">
            <div class="flex w-1/2 flex-col gap-1">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="rounded-xl px-4 py-2 border border-black"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div class="flex w-1/2 flex-col gap-1">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className="rounded-xl px-4 py-2 border border-black"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div class="flex items-center justify-center flex-col gap-2">
            {error && <div className="text-red-500">{error}</div>}
            <button
              type="submit"
              class="mt-5 rounded-xl bg-[#DC3A3A] px-16 py-2 text-white drop-shadow-xl duration-300 hover:bg-[#BE3030]"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
