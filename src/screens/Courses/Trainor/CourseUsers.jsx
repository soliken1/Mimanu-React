import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import AddEmployeeModal from "../../../components/AddEmployeeModal";
import fetchEnrolledEmployees from "../../../hooks/get/fetchEnrolledEmployees";

const CourseUsers = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrolledEmployees, setEnrolledEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const enrolled = await fetchEnrolledEmployees(courseId);
        setEnrolledEmployees(enrolled);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [courseId]);

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 ps-66 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="flex flex-col">
          <label className="text-xl font-semibold">
            {courseData?.CourseTitle}
          </label>
          <label className="text-sm text-gray-600">
            {courseData?.CourseDescription}
          </label>
        </div>
        <div className="w-full h-full flex flex-row mt-6">
          <CourseSidebar userData={userData} />
          <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between">
              <label className="text-xl font-semibold">Employee List</label>
              <button
                className="px-4 py-2 cursor-pointer text-white rounded-lg shadow-y bg-[#152852]"
                onClick={() => setIsModalOpen(true)}
              >
                Add Employee
              </button>
            </div>
            {/* Employees Table */}
            <div className="w-full mt-5 bg-white shadow-md rounded-lg ">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left">Profile</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Date Enrolled</th>
                    <th className="py-3 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {enrolledEmployees.length > 0 ? (
                    enrolledEmployees.map((employee) => (
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

export default CourseUsers;
