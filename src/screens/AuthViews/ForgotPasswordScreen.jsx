import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfigs";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  // Regular expression for basic email format validation
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Check if the email format is valid
    if (!emailFormat.test(email)) {
      setError(
        "The email address format is invalid. Please enter a valid email."
      );
      setMessage(""); // Clear success messages on error
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Password Reset link successfully sent! Please check your email.",
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        }
      );

      // Clear input fields after success
      setEmail("");
      setError(""); // Clear any error state
      setMessage(""); // Clear any message

      // Redirect to the login screen after success
      navigate("/login"); // Adjust the route to your LoginScreen path
    } catch (err) {
      setError("An error occurred. Please try again later.");
      setMessage(""); // Clear any success message on error
      setEmail(""); // Clear email input field on error
    }
  };

  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden">
      <div className="-z-0 relative hidden h-full w-7/12 flex-col bg-[#FAF9F6] md:flex">
        <img src="/mimanu.png" className="w-[400px] absolute left-28 top-28 " />
        <label className="absolute left-52 top-52 w-[550px] text-4xl font-normal text-[#152852]">
          A Training Management System
        </label>
        <div className="opacity-60 absolute -bottom-80 left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
        <div className="opacity-60 absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
      </div>
      <div className="z-10 shadow-x flex h-full w-full flex-col items-center justify-center rounded-s-xl md:w-5/12">
        <img className="h-24" src="/mimanusingle.png" />
        <label className="text-3xl">Forgot Your Password?</label>
        <label className="text-sm font-medium">
          Please Enter Your Email For Verification
        </label>
        <form
          onSubmit={handlePasswordReset}
          className="mt-5 flex w-full flex-col gap-5 px-16"
        >
          <div className="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img className="h-5 w-5" src="/email.svg" />
            <input
              className="border-0 mx-4 w-full bg-transparent placeholder:text-black"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              value={email}
              type="email"
            />
            <span
              asp-validation-for="Email"
              className="absolute end-0 right-6 text-xs text-red-500"
            ></span>
          </div>
          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="mt-5 flex h-auto w-full items-center justify-center">
            <button
              className="h-12 w-64 rounded-xl bg-[#DC3A3A] text-white duration-300 hover:bg-[#BC3232]"
              type="submit"
            >
              Send
            </button>
          </div>
          <div className="flex h-auto w-full flex-row items-center justify-center md:px-12">
            <label className="text-sm font-semibold text-[#DC3A3A] underline">
              <Link to="/">Go Back</Link>
            </label>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordScreen;
