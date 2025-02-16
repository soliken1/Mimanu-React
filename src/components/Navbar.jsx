import React, { useState, useEffect } from "react";
import Book from "../../src/assets/book.png";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfigs";
import NavbarLoading from "./NavbarLoading";

const Navbar = ({ userData }) => {
  const [username, setUsername] = useState("");
  const [userImg, setUserImg] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const displayUser = async () => {
      if (!userData) {
        setUsername("");
        setUserImg(null);
        return;
      }

      if (userData.Username) {
        setUsername(userData.Username);
        setUserImg(userData.UserImg);
        setisLoading(false);
      } else {
        setisLoading(false);
      }
    };

    displayUser();
  }, [userData]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return <NavbarLoading />;
  }

  return (
    <div className="md:shadow-y z-10 fixed bottom-0 left-0 md:top-0 md:fixed md:flex h-20 w-full items-center justify-between md:bg-[#152852] px-8">
      <div className="hidden flex-row items-center justify-center gap-5 md:flex">
        <img src={Book} className="h-16 w-16 drop-shadow-lg" />
        <label className="text-lg font-bold text-white">MiManuTMS</label>
      </div>
      {userData?.UserRole === "Admin" ? (
        <div className="flex justify-center items-center">
          <div class="hidden flex-row gap-8 md:flex">
            <Link
              to="/admindashboard"
              class="flex flex-row items-center justify-center gap-4"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white duration-300 hover:border-b">
                Home
              </label>
            </Link>
            <Link
              class="flex flex-row items-center justify-center gap-4"
              to="/register"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white duration-300 hover:border-b">
                Register
              </label>
            </Link>
          </div>
          <div class="flex-1 flex flex-row items-center justify-center mt-5 gap-8 md:hidden">
            <Link
              to="/admindashboard"
              class="flex items-center justify-center"
              asp-area=""
              asp-controller="Home"
              asp-action="Dashboard"
            >
              <svg
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10.1667L12.5 2L23 10.1667V23C23 23.6188 22.7542 24.2123 22.3166 24.6499C21.879 25.0875 21.2855 25.3333 20.6667 25.3333H4.33333C3.71449 25.3333 3.121 25.0875 2.68342 24.6499C2.24583 24.2123 2 23.6188 2 23V10.1667Z"
                  stroke="#152852"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.99976 25.3334V13.6667H15.9998V25.3334"
                  stroke="#152852"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
            <Link
              class="flex flex-row items-center justify-center gap-4"
              to="/register"
            >
              <svg
                width="30"
                height="30"
                viewBox="-2 -2 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.5"
                  cy="12.5"
                  r="11.5"
                  stroke="#152852"
                  stroke-width="3"
                />
                <path
                  d="M12.5 6.94434V18.0554"
                  stroke="#152852"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.94434 12.5H18.0554"
                  stroke="#152852"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden flex-row gap-8 md:flex">
            <Link
              to="/dashboard"
              className="flex flex-row items-center justify-center gap-4 duration-300"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white duration-300 hover:border-b">
                Home
              </label>
            </Link>
            <Link
              className="flex flex-row items-center justify-center gap-4 duration-300"
              asp-area=""
              asp-controller="Courses"
              asp-action="Course"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white duration-100 hover:border-b">
                Courses
              </label>
            </Link>
            <Link
              className="flex flex-row items-center justify-center gap-4 duration-300"
              asp-area=""
              asp-controller="Diagnostic"
              asp-action="Summary"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white duration-300 hover:border-b">
                Diagnostic
              </label>
            </Link>
            <Link
              className="flex flex-row items-center justify-center gap-4 duration-300"
              to="/editprofile"
            >
              <label className="cursor-pointer rounded-xl border-white px-4 py-2 text-lg text-white hover:border-b">
                Settings
              </label>
            </Link>
          </div>
          <div className="flex-1 flex flex-row items-center justify-center gap-8 md:hidden">
            <Link className="flex items-center justify-center">
              <svg
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10.1667L12.5 2L23 10.1667V23C23 23.6188 22.7542 24.2123 22.3166 24.6499C21.879 25.0875 21.2855 25.3333 20.6667 25.3333H4.33333C3.71449 25.3333 3.121 25.0875 2.68342 24.6499C2.24583 24.2123 2 23.6188 2 23V10.1667Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.99976 25.3334V13.6667H15.9998V25.3334"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link className="flex items-center justify-center">
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 27C21.4036 27 27 21.4036 27 14.5C27 7.59644 21.4036 2 14.5 2C7.59644 2 2 7.59644 2 14.5C2 21.4036 7.59644 27 14.5 27Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.8 9.20001L17.15 17.15L9.19995 19.8L11.85 11.85L19.8 9.20001Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link className="flex items-center justify-center">
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.0124 19.3665C25.2172 21.2476 23.9734 22.9051 22.3899 24.1943C20.8063 25.4834 18.9311 26.3649 16.9282 26.7617C14.9253 27.1585 12.8558 27.0585 10.9005 26.4704C8.94517 25.8823 7.16366 24.8241 5.71169 23.3883C4.25972 21.9524 3.18149 20.1826 2.57128 18.2337C1.96107 16.2847 1.83746 14.2159 2.21125 12.2081C2.58503 10.2004 3.44484 8.31473 4.7155 6.71611C5.98615 5.11749 7.62897 3.85456 9.50032 3.03772"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M26.9999 14.5029C26.9999 12.861 26.6766 11.2352 26.0485 9.71825C25.4203 8.20133 24.4996 6.82302 23.3389 5.66202C22.1782 4.50102 20.8002 3.58006 19.2837 2.95173C17.7671 2.3234 16.1417 2 14.5002 2V14.5029H26.9999Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link className="flex items-center justify-center">
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4999 17.9091C16.3827 17.9091 17.909 16.3828 17.909 14.5C17.909 12.6172 16.3827 11.0909 14.4999 11.0909C12.6171 11.0909 11.0908 12.6172 11.0908 14.5C11.0908 16.3828 12.6171 17.9091 14.4999 17.9091Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.9091 17.9091C22.7578 18.2518 22.7127 18.632 22.7795 19.0007C22.8464 19.3693 23.0221 19.7095 23.2841 19.9773L23.3523 20.0455C23.5636 20.2565 23.7312 20.5072 23.8456 20.7831C23.96 21.059 24.0188 21.3547 24.0188 21.6534C24.0188 21.9521 23.96 22.2478 23.8456 22.5237C23.7312 22.7996 23.5636 23.0503 23.3523 23.2614C23.1412 23.4727 22.8905 23.6403 22.6146 23.7547C22.3387 23.8691 22.043 23.9279 21.7443 23.9279C21.4456 23.9279 21.1499 23.8691 20.874 23.7547C20.5981 23.6403 20.3474 23.4727 20.1364 23.2614L20.0682 23.1932C19.8004 22.9312 19.4602 22.7555 19.0916 22.6886C18.7229 22.6218 18.3427 22.6669 18 22.8182C17.6639 22.9622 17.3773 23.2014 17.1753 23.5063C16.9734 23.8112 16.8651 24.1684 16.8636 24.5341V24.7273C16.8636 25.33 16.6242 25.9081 16.198 26.3343C15.7718 26.7606 15.1937 27 14.5909 27C13.9881 27 13.4101 26.7606 12.9838 26.3343C12.5576 25.9081 12.3182 25.33 12.3182 24.7273V24.625C12.3094 24.2489 12.1876 23.8841 11.9688 23.5781C11.7499 23.2721 11.444 23.039 11.0909 22.9091C10.7482 22.7578 10.368 22.7127 9.99933 22.7795C9.6307 22.8464 9.29054 23.0221 9.02273 23.2841L8.95455 23.3523C8.74347 23.5636 8.49281 23.7312 8.21691 23.8456C7.941 23.96 7.64526 24.0188 7.34659 24.0188C7.04792 24.0188 6.75218 23.96 6.47627 23.8456C6.20037 23.7312 5.94971 23.5636 5.73864 23.3523C5.52733 23.1412 5.35969 22.8905 5.24532 22.6146C5.13095 22.3387 5.07208 22.043 5.07208 21.7443C5.07208 21.4456 5.13095 21.1499 5.24532 20.874C5.35969 20.5981 5.52733 20.3474 5.73864 20.1364L5.80682 20.0682C6.06879 19.8004 6.24453 19.4602 6.31137 19.0916C6.37821 18.7229 6.33309 18.3427 6.18182 18C6.03777 17.6639 5.79859 17.3773 5.49371 17.1753C5.18884 16.9734 4.83158 16.8651 4.46591 16.8636H4.27273C3.66996 16.8636 3.09189 16.6242 2.66567 16.198C2.23945 15.7718 2 15.1937 2 14.5909C2 13.9881 2.23945 13.4101 2.66567 12.9838C3.09189 12.5576 3.66996 12.3182 4.27273 12.3182H4.375C4.75113 12.3094 5.11591 12.1876 5.42193 11.9688C5.72795 11.7499 5.96104 11.444 6.09091 11.0909C6.24218 10.7482 6.2873 10.368 6.22046 9.99933C6.15362 9.6307 5.97788 9.29054 5.71591 9.02273L5.64773 8.95455C5.43642 8.74347 5.26878 8.49281 5.15441 8.21691C5.04004 7.941 4.98117 7.64526 4.98117 7.34659C4.98117 7.04792 5.04004 6.75218 5.15441 6.47627C5.26878 6.20037 5.43642 5.94971 5.64773 5.73864C5.8588 5.52733 6.10946 5.35969 6.38536 5.24532C6.66127 5.13095 6.95701 5.07208 7.25568 5.07208C7.55435 5.07208 7.8501 5.13095 8.126 5.24532C8.40191 5.35969 8.65256 5.52733 8.86364 5.73864L8.93182 5.80682C9.19964 6.06879 9.53979 6.24453 9.90842 6.31137C10.2771 6.37821 10.6573 6.33309 11 6.18182H11.0909C11.427 6.03777 11.7137 5.79859 11.9156 5.49371C12.1175 5.18884 12.2258 4.83158 12.2273 4.46591V4.27273C12.2273 3.66996 12.4667 3.09189 12.8929 2.66567C13.3192 2.23945 13.8972 2 14.5 2C15.1028 2 15.6808 2.23945 16.1071 2.66567C16.5333 3.09189 16.7727 3.66996 16.7727 4.27273V4.375C16.7742 4.74067 16.8825 5.09793 17.0844 5.4028C17.2863 5.70768 17.573 5.94686 17.9091 6.09091C18.2518 6.24218 18.632 6.2873 19.0007 6.22046C19.3693 6.15362 19.7095 5.97788 19.9773 5.71591L20.0455 5.64773C20.2565 5.43642 20.5072 5.26878 20.7831 5.15441C21.059 5.04004 21.3547 4.98117 21.6534 4.98117C21.9521 4.98117 22.2478 5.04004 22.5237 5.15441C22.7996 5.26878 23.0503 5.43642 23.2614 5.64773C23.4727 5.8588 23.6403 6.10946 23.7547 6.38536C23.8691 6.66127 23.9279 6.95701 23.9279 7.25568C23.9279 7.55435 23.8691 7.8501 23.7547 8.126C23.6403 8.40191 23.4727 8.65256 23.2614 8.86364L23.1932 8.93182C22.9312 9.19964 22.7555 9.53979 22.6886 9.90842C22.6218 10.2771 22.6669 10.6573 22.8182 11V11.0909C22.9622 11.427 23.2014 11.7137 23.5063 11.9156C23.8112 12.1175 24.1684 12.2258 24.5341 12.2273H24.7273C25.33 12.2273 25.9081 12.4667 26.3343 12.8929C26.7606 13.3192 27 13.8972 27 14.5C27 15.1028 26.7606 15.6808 26.3343 16.1071C25.9081 16.5333 25.33 16.7727 24.7273 16.7727H24.625C24.2593 16.7742 23.9021 16.8825 23.5972 17.0844C23.2923 17.2863 23.0531 17.573 22.9091 17.9091Z"
                  stroke="#152852"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </>
      )}

      <div className="flex flex-row gap-5">
        <div className="flex flex-row items-center justify-center gap-5">
          <Link to="/profile">
            <div className="flex-row items-center justify-center gap-5 md:flex hidden">
              {isLoading ? (
                <label className="w-28 h-4 rounded-full animate-pulse duration-300 bg-[#050419]"></label>
              ) : (
                <label className="hidden text-white md:flex cursor-pointer">
                  {username}
                </label>
              )}

              <img
                src={userImg}
                className="h-12 w-12 rounded-full object-cover shadow-sm shadow-[#152852]"
              />
            </div>
          </Link>
          <button onClick={logout} className="hidden md:flex">
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#152852] shadow-sm duration-300 hover:bg-[#0B162D]">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="28.1818"
                  height="28.1818"
                  transform="translate(0.90918 0.909119)"
                  fill=""
                />
                <path
                  d="M9.12891 9.28376V7.86967C9.12891 5.72377 9.12891 4.65082 9.8185 4.05274C10.5081 3.45466 11.5703 3.60639 13.6946 3.90987L20.4168 4.87019C22.873 5.22107 24.101 5.3965 24.8347 6.2424C25.5683 7.08829 25.5683 8.32882 25.5683 10.8099V19.1902C25.5683 21.6713 25.5683 22.9118 24.8347 23.7577C24.101 24.6036 22.873 24.779 20.4168 25.1299L13.6946 26.0902C11.5703 26.3937 10.5081 26.5454 9.8185 25.9474C9.12891 25.3493 9.12891 24.2763 9.12891 22.1304V20.9487"
                  stroke="white"
                  strokeWidth="3"
                />
                <path
                  d="M19.697 15.0001L20.8683 14.063L21.618 15.0001L20.8683 15.9371L19.697 15.0001ZM5.60611 16.5001C4.77768 16.5001 4.10611 15.8285 4.10611 15.0001C4.10611 14.1716 4.77768 13.5001 5.60611 13.5001V16.5001ZM16.1714 8.1918L20.8683 14.063L18.5257 15.9371L13.8287 10.0659L16.1714 8.1918ZM20.8683 15.9371L16.1714 21.8083L13.8287 19.9342L18.5257 14.063L20.8683 15.9371ZM19.697 16.5001H5.60611V13.5001H19.697V16.5001Z"
                  fill="white"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
