import React from "react";

const RegisterUserModal = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  error,
}) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg ">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold text-[#152852]">
            Register User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 w-8 text-2xl hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="text-[#152852]">Username</label>
            <input
              name="username"
              value={formData.username}
              readOnly
              className="w-full rounded-lg px-4 py-2 border border-gray-300 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              This is displayed throughout the public website instead of your
              full name.
            </p>
          </div>

          {/* First Name & Last Name */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-[#152852]">First Name</label>
              <input
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 border border-gray-300"
              />
            </div>
            <div className="w-1/2">
              <label className="text-[#152852]">Last Name</label>
              <input
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 border border-gray-300"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-[#152852]">Role</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Trainor"
                  onChange={handleChange}
                  checked={formData.role === "Trainor"}
                />
                Trainor
              </label>
              <label className="flex items-center gap-2">
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

          {/* Email */}
          <div>
            <label className="text-[#152852]">Email</label>
            <input
              name="email"
              type="email"
              placeholder="sampleemail@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2 border border-gray-300"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 border border-gray-300"
              />
            </div>
            <div className="w-1/2">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2 border border-gray-300"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
