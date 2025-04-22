import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfigs";
import { db } from "../../config/firebaseConfigs";
import { doc, getDoc, setDoc, deleteDoc, query, where, getDocs, collection } from "firebase/firestore";
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";


const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  

  const login = async () => {
    try {
      // Step 1: Check if the user exists by email as the document ID for silent registration
      const userDocRef = doc(db, "Users", email);
      const userDoc = await getDoc(userDocRef);

      // If the user document exists, it could be a pending registration
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Validate if the password field exists
      if (!userData.Password) {
        console.log("Password not found in the database.");
        return;
      }

      // Check if the entered password matches the stored password hash
      const passwordMatch = await bcrypt.compare(password, userData.Password);

      if (!passwordMatch) {
        // If the passwords do not match, show an error message and do not proceed
        toast.error("Password do not match, please try again!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

        
        // If the user is pending (isPending is true), proceed with registration
        if (userData.isPending) {
          // Create the user without logging them in
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
          // Send email verification after the user is created
          await sendEmailVerification(userCredential.user);
    
          // Create a new user document with the uid as the document ID
          const newUserDocRef = doc(db, "Users", userCredential.user.uid);
    
          // Transfer all data from the old document to the new document
          await setDoc(newUserDocRef, {
            ...userData, // Transfer all fields from the old document
            isPending: false,  // Update isPending to false
            Password: null,  // Remove the password field
            UID: userCredential.user.uid,  // Store the UID
            Email: userCredential.user.email,  // Store the email
          });
    
          // Delete the old document with the email as the document ID
          await deleteDoc(userDocRef);
          return;
        }
      } else {
        // Step 2: If the document with the email does not exist, search the Users collection for matching email
        const usersQuery = query(collection(db, "Users"), where("Email", "==", email));
        const querySnapshot = await getDocs(usersQuery);

        if (querySnapshot.empty) {
          toast.error("User does not exist, Please contact you Admin.", {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          return;
        }

        const userDoc = querySnapshot.docs[0]; // Get the first matching document
        const userData = userDoc.data();

        // Step 3: Proceed with login if the user is found in the query result
        await signInWithEmailAndPassword(auth, email, password);
        
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(null);
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid Credentials, Please Try again!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
      } else if (error.code === "auth/invalid-email-verified") {
        setErrorMessage("Email not Verified! Please check your email.");
      }
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden">
      <div className="-z-0 relative hidden h-full w-7/12 flex-col bg-[#FAF9F6] md:flex">
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
        <img className="h-48 w-48" src="/book.png" />
        <label className="text-3xl">Welcome Back!</label>
        <label className="text-sm font-medium">
          Enter Your Credentials To Login
        </label>
        <div method="post" className="mt-5 flex w-full flex-col gap-5 px-16">
          <div className="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img className="h-5 w-5" src="/email.svg" />
            <input
              className="border-0 mx-4 w-full bg-transparent placeholder:text-black"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="inner-shadow relative flex flex-row items-center rounded-xl px-8 py-2 transition-all duration-300 focus:outline-none focus:border-0">
            <img className="h-5 w-5" src="/password.svg" />
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
      <ToastContainer />
    </div>
    
  );
};

export default LoginScreen;
