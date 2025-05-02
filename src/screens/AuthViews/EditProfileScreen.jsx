import React, { useState, useEffect } from "react";
import NavSidebar from "../../components/NavSidebar";
import { useNavigate } from "react-router-dom";
import fetchUser from "../../hooks/get/fetchUser";
import { doc, updateDoc } from "firebase/firestore"; // Firestore
import axios from "axios"; // Axios for Cloudinary upload
import { db, auth } from "../../config/firebaseConfigs";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { Link } from "react-router-dom";
import HelpButton from "../../components/HelpButton";
import Loader from "../../components/Loader";
const EditProfileScreen = ({ getUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userImg, setUserImg] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const data = await fetchUser(getUser.uid);
        setUserData(data);
        setEmail(data.Email || "");
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetUserData();
  }, [getUser.uid]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Attach the file
    formData.append("upload_preset", "mimanuProfileImg"); // Your Cloudinary upload preset
    formData.append("folder", "mimanuProfiles"); // Specify the folder for the image

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwnawhcfm/image/upload", // Correct Cloudinary endpoint
        formData
      );
      return response.data.secure_url; // Return the uploaded image's URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    try {
      let updatedImageUrl = userData.UserImg;

      // Handle image update
      if (userImg) {
        updatedImageUrl = await handleImageUpload(userImg);
      }

      // Only reauthenticate if email or password is being updated
      if (email !== user.email || newPassword || confirmPassword) {
        if (!currentPassword) {
          alert("Current password is required to update email or password.");
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      }

      // Handle email update
      if (email !== user.email && email.trim() !== "") {
        await updateEmail(user, email);
        await sendEmailVerification(user);
        alert(
          "Email updated. A verification email has been sent to the new email address."
        );

        // Update email in Firestore
        const userDocRef = doc(db, "Users", getUser.uid);
        await updateDoc(userDocRef, { Email: email });
      }

      // Handle password update
      if (newPassword || confirmPassword) {
        if (newPassword === confirmPassword) {
          await updatePassword(user, newPassword);
          alert("Password updated successfully.");
        } else {
          alert("New password and confirmation do not match.");
          return;
        }
      }

      // Update Firestore with profile image (only if image was updated)
      if (userImg) {
        const userDocRef = doc(db, "Users", getUser.uid);
        await updateDoc(userDocRef, {
          UserImg: updatedImageUrl,
        });
      }

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.code === "auth/wrong-password") {
        alert("Incorrect current password. Please try again.");
      } else if (error.code === "auth/requires-recent-login") {
        alert("Please log in again to update your profile.");
        navigate("/login");
      } else if (error.code === "auth/operation-not-allowed") {
        alert("Please verify the new email before changing email.");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
      setUserImg(file);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <form
        onSubmit={handleUpdateProfile}
        className="w-full ps-72 h-auto min-h-screen px-12 pb-12 pt-16 flex flex-col bg-[#FAF9F6]"
      >
        <div className="flex flex-row w-full gap-12">
          <div className="w-2/4 shadow-y p-8 rounded-xl">
            <label className="text-xl font-semibold">Edit Profile</label>
            <div className="mb-4">
              <div className="flex flex-col items-center mt-5">
                <img
                  src={previewImg || userImg || userData.UserImg}
                  className="w-32 h-32 rounded-full object-cover mb-2"
                  alt="Profile"
                />

                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 rounded-full py-1 shadow-md px-4"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="Email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="Email"
                disabled={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full  px-4 py-2 rounded-lg bg-gray-200"
              />
            </div>
          </div>
          <div className="w-2/4 shadow-y p-8 rounded-xl">
            <label className="text-xl font-semibold">Change Password</label>
            <div className="mb-4 mt-8">
              <label
                htmlFor="CurrentPassword"
                className="block mb-2 font-medium"
              >
                Current Password
              </label>
              <input
                type="password"
                id="CurrentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="NewPassword" className="block mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                id="NewPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="ConfirmPassword"
                className="block mb-2 font-medium"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="ConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex justify-center items-center gap-5 mt-12">
          <button
            type="submit"
            className="px-12 py-2 cursor-pointer bg-[#152852] text-white rounded-lg"
          >
            Update
          </button>

          <Link
            to="/profile"
            className="px-12 py-2 cursor-pointer bg-gray-700 text-white rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
      <HelpButton />
    </div>
  );
};

export default EditProfileScreen;
