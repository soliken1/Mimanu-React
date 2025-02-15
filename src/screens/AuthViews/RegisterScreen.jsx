import React from "react";

const RegisterScreen = () => {
  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="h-full w-full p-8 md:w-3/12">
        <div className="shadow-xy flex h-32 w-full flex-col rounded-xl py-6 md:h-64">
          <div className="px-8 font-semibold">
            <label className="text-[#152852]">Accounts</label>
          </div>

          <div className="border-s-4 mx-4 mt-2 flex flex-row items-center gap-2 rounded-e-lg border-[#DC3A3A] bg-gray-100 px-4">
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
            <label className="text-[#152852]">Account Creation</label>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-4 p-8 md:w-9/12">
        <div className="border-b-2 border-b-red-500 py-2">
          <label className="w-full text-xl font-semibold text-[#152852]">
            Register User
          </label>
        </div>

        <form
          className="flex w-full flex-col gap-4"
          asp-action="Register"
          method="post"
        >
          <div className="flex w-full flex-col gap-1">
            <label className="text-[#152852]" asp-for="Username"></label>
            <input
              asp-for="Username"
              placeholder="EMP_jDoe"
              id="Username"
              readonly
              className="w-full rounded-xl px-4 py-2"
            />
            <label className="text-xs">
              This is displayed throughout the public within the website instead
              of your full name.
            </label>
            <span
              asp-validation-for="Username"
              id="UsernameSpan"
              className="text-xs text-red-500"
            ></span>
          </div>

          <div className="flex w-full flex-row gap-5">
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-[#152852]" asp-for="FirstName">
                First Name
              </label>
              <input
                asp-for="FirstName"
                placeholder="John"
                id="FirstName"
                className="rounded-xl px-4 py-2"
              />
              <span
                asp-validation-for="FirstName"
                className="text-xs text-red-500"
              ></span>
            </div>

            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-[#152852]" asp-for="LastName">
                Last Name
              </label>
              <input
                asp-for="LastName"
                placeholder="Doe"
                id="LastName"
                className="rounded-xl px-4 py-2"
              />
              <span
                asp-validation-for="LastName"
                className="text-xs text-red-500"
              ></span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#152852]">Role</label>
            <div className="flex flex-row items-center gap-4">
              <input
                type="radio"
                asp-for="Role"
                id="Trainor"
                value="Trainor"
                onclick="clearRoleError()"
              />{" "}
              Trainor
              <br />
              <input
                type="radio"
                asp-for="Role"
                id="Employee"
                value="Employee"
                onclick="clearRoleError()"
              />{" "}
              Employee
              <br />
            </div>
            <span
              asp-validation-for="Role"
              className="text-xs text-red-500"
              id="RoleError"
            ></span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#152852]" asp-for="Email"></label>
            <input
              asp-for="Email"
              placeholder="sampleemail@example.com"
              className="rounded-xl px-4 py-2"
            />
            <span
              asp-validation-for="Email"
              className="text-xs text-red-500"
            ></span>
          </div>

          <div className="flex w-full flex-row gap-5">
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-[#152852]" asp-for="Password"></label>
              <input
                asp-for="Password"
                type="password"
                className="rounded-xl px-4 py-2"
              />
              <span
                asp-validation-for="Password"
                className="text-xs text-red-500"
              ></span>
            </div>

            <div className="flex w-1/2 flex-col gap-1">
              <label asp-for="ConfirmPassword">Confirm Password</label>
              <input
                asp-for="ConfirmPassword"
                type="password"
                className="rounded-xl px-4 py-2"
              />
              <span
                asp-validation-for="ConfirmPassword"
                className="text-xs text-red-500"
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-5 rounded-xl bg-[#DC3A3A] px-16 py-2 text-white drop-shadow-xl duration-300 hover:bg-[#BE3030]"
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
