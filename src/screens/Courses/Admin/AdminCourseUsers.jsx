import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import AddEmployeeModal from "../../../components/AddEmployeeModal";
import fetchEnrolledEmployees from "../../../hooks/get/fetchEnrolledEmployees";
import removeEnrolledEmployee from "../../../hooks/delete/removeEnrolledEmployee";
import Loader from "../../../components/Loader";
const AdminCourseUsers = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrolledEmployees, setEnrolledEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const enrolled = await fetchEnrolledEmployees(courseId);
        setEnrolledEmployees(enrolled);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [courseId]);

  const filteredEmployees = enrolledEmployees.filter((employee) =>
    `${employee.FirstName} ${employee.LastName} ${employee.Email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleRemoveEmployee = async (enrolledId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this employee?"
    );
    if (confirmDelete) {
      const success = await removeEnrolledEmployee(enrolledId);
      if (success) {
        setEnrolledEmployees(
          enrolledEmployees.filter((emp) => emp.id !== enrolledId)
        );
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen md:p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col px-4 pt-12 md:px-0 md:pt-0">
            <label className="text-xl font-semibold">
              {courseData?.CourseTitle}
            </label>
            <label className="text-sm text-gray-600">
              {courseData?.CourseDescription}
            </label>
          </div>
          <CourseSidebar userData={userData} />
        </div>
        <div className="w-full h-full flex flex-row mt-6 px-4 md:px-0 md:pt-0">
          <div className="flex-1 flex flex-col">
            <div className="flex md:flex-row flex-col md:gap-0 gap-2 justify-between">
              <label className="text-xl font-semibold">Employee List</label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="px-3 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="px-4 py-2 cursor-pointer text-white rounded-lg shadow-y bg-[#152852]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Employee
                </button>
              </div>
            </div>
            {/* Employees Table */}
            <div className="w-full mt-5 bg-white shadow-md rounded-lg">
              <table className="w-full border-collapse overflow-x-auto">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left">Profile</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Date Enrolled</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className=" hover:bg-gray-100">
                        <td className="py-3 px-6 flex flex-row items-center gap-4">
                          <img
                            src={employee.UserImg}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {employee.FirstName} {employee.LastName}
                        </td>
                        <td className="py-3 px-6 text-gray-800">
                          {employee.Email}
                        </td>
                        <td className="py-3 px-6 text-gray-800">
                          {new Date(
                            employee.DateEnrolled?.seconds * 1000
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6">
                          <label className="bg-green-500 text-white rounded-sm px-2 py-1">
                            Active
                          </label>
                        </td>
                        <td className="py-3 px-6">
                          <button
                            onClick={() => handleRemoveEmployee(employee.id)}
                            className="text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No employees enrolled yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AdminCourseUsers;
