import React, { useEffect, useState } from "react";
import fetchNotEnrolledEmployees from "../hooks/get/fetchNotEnrolledEmployees";
import addEnrolledEmployee from "../hooks/post/addEnrolledEmployee";
import { useParams } from "react-router-dom"; // To get CourseID from URL
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";
import sendCourseNotif from "../utils/sendCourseNotif";
const AddEmployeeModal = ({ isOpen, onClose }) => {
  const { courseId } = useParams(); // Extract courseID from URL
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const data = await fetchNotEnrolledEmployees(courseId);
      setEmployees(data);
    };
    if (isOpen) getEmployees();
  }, [isOpen]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSelectEmployee = (employee) => {
    if (
      selectedEmployees.length < 1 ||
      !selectedEmployees.find((e) => e.id === employee.id)
    ) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employeeId));
  };

  const handleEnrollEmployees = async () => {
    if (!courseId || selectedEmployees.length === 0) return;

    for (const employee of selectedEmployees) {
      const result = await addEnrolledEmployee(employee.id, courseId);
      await sendCourseNotif(courseId, employee.Email, employee.Username);
      if (result.success) {
        toast.success("User Added Successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        console.error("Error Adding User:", result.message);
        toast.error(`${result.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }

    setTimeout(() => {
      window.location.reload();
      onClose();
    }, 3000);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.FirstName.toLowerCase().includes(searchQuery) ||
      employee.LastName.toLowerCase().includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Add Employee</h2>

        {/* Selected Employees */}
        <div className="mb-4 p-2 border rounded bg-gray-100 flex flex-col gap-2 h-32 overflow-y-auto">
          {selectedEmployees.length > 0 ? (
            selectedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-2 bg-gray-200 rounded"
              >
                <span className="items-center flex flex-row gap-4">
                  <img
                    src={employee.UserImg}
                    className="w-6 h-6 rounded-full object-cover"
                  />{" "}
                  {employee.FirstName} {employee.LastName}
                </span>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => handleRemoveEmployee(employee.id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No employees selected</span>
          )}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full p-2 border rounded mb-3"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Employee Dropdown List */}
        <div className="max-h-40 overflow-y-auto border rounded">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-2 cursor-pointer hover:bg-gray-200 flex items-center justify-between ${
                  selectedEmployees.find((e) => e.id === employee.id)
                    ? "bg-gray-300"
                    : ""
                }`}
                onClick={() => handleSelectEmployee(employee)}
              >
                <span className="items-center flex flex-row gap-4">
                  <img
                    src={employee.UserImg}
                    className="w-6 h-6 rounded-full object-cover"
                  />{" "}
                  {employee.FirstName} {employee.LastName}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center p-2 text-gray-500">No employees found</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-[#152852] text-white rounded"
            onClick={handleEnrollEmployees}
          >
            Add
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEmployeeModal;
