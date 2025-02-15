import React from "react";
import Book from "../../assets/book.png";
import Email from "../../assets/email.svg";
import Password from "../../assets/password.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfigs";
const LoginScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      onLogin();
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(null);
      if (error.code === "auth/missing-password") {
        setErrorMessage("Password is Empty");
      } else if (error.code === "auth/missing-email") {
        setErrorMessage("Email is Empty");
      } else {
        setErrorMessage("Please Input Appropriate Fields");
      }
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden">
      <div className="-z-0 relative hidden h-full w-7/12 flex-col bg-[#FFFFF7] md:flex">
        <label className="absolute left-32 top-28 text-6xl font-bold text-[#152852]">
          MiManuTMS
        </label>
        <label className="absolute left-32 top-48 w-[550px] text-4xl font-normal text-[#152852]">
          A Training Management System MinebeaMitsumi Cebu
        </label>
        <div className="opacity-60 absolute -bottom-80 left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
        <div className="opacity-60 absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-[#152852]"></div>
      </div>
      <div className="z-10 shadow-x flex h-full w-full flex-col items-center justify-center rounded-s-xl md:w-5/12">
        <img className="h-48 w-48" src={Book} />
        <label className="text-3xl">Welcome Back!</label>
        <label className="text-sm font-medium">
          Enter Your Credentials To Login
        </label>
        <div method="post" className="mt-5 flex w-full flex-col gap-5 px-16">
          <div className="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img className="h-5 w-5" src={Email} />
            <input
              className="border-0 mx-4 w-full bg-transparent placeholder:text-black"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img className="h-5 w-5" src={Password} />
            <input
              placeholder="Password"
              className="border-0 mx-4 w-full bg-transparent placeholder:text-black"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex h-auto w-full flex-row items-center justify-between md:px-12">
            <div className="flex items-center justify-center gap-3">
              <input
                type="checkbox"
                id="tosInput"
                className="border-2 rounded-md border-black"
              />
              <label className="text-sm font-medium">Remember Me</label>
            </div>
            <label className="text-sm font-semibold text-[#DC3A3A] underline">
              <Link to="/forgotpassword">Forgot Password?</Link>
            </label>
          </div>
          <div className="flex h-auto w-full flex-col gap-5 items-center justify-center">
            {errorMessage && (
              <label className="text-xs text-red-400">{errorMessage}</label>
            )}
            <button
              className="h-12 w-64 rounded-xl bg-[#DC3A3A] cursor-pointer text-white duration-300 hover:bg-[#BC3232]"
              type="submit"
              onClick={login}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
