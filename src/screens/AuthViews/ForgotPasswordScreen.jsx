import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebaseConfigs";
import { sendPasswordResetEmail } from "firebase/auth";
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };
  return (
    <div class="flex h-screen w-screen flex-row overflow-hidden">
      <div class="-z-0 relative hidden h-full w-7/12 flex-col bg-[#FFFFF7] md:flex">
        <label class="absolute left-32 top-28 text-6xl font-bold text-[#152852]">
          MiManuTMS
        </label>
        <label class="absolute left-32 top-48 w-[550px] text-4xl font-normal text-[#152852]">
          A Training Management System MinebeaMitsumi Cebu
        </label>
        <div class="opacity-60 absolute -bottom-80 left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
        <div class="opacity-60 absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
      </div>
      <div class="z-10 shadow-x flex h-full w-full flex-col items-center justify-center rounded-s-xl md:w-5/12">
        <img class="h-48 w-48" src="/book.png" />
        <label class="text-3xl">Forgot Your Password?</label>
        <label class="text-sm font-medium">
          Please Enter Your Email For Verification
        </label>
        <form
          onSubmit={handlePasswordReset}
          class="mt-5 flex w-full flex-col gap-5 px-16"
        >
          <div class="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img class="h-5 w-5" src="/email.svg" />
            <input
              class="border-0 mx-4 w-full bg-transparent placeholder:text-black"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              value={email}
              type="email"
            />
            <span
              asp-validation-for="Email"
              class="absolute end-0 right-6 text-xs text-red-500"
            ></span>
          </div>
          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div class="mt-5 flex h-auto w-full items-center justify-center">
            <button
              class="h-12 w-64 rounded-xl bg-[#DC3A3A] text-white duration-300 hover:bg-[#BC3232]"
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
    </div>
  );
};

export default ForgotPasswordScreen;
