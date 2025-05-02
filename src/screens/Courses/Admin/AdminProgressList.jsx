import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { Link, useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import CourseSidebar from "../../../components/CourseSidebar";
import fetchEnrolledUsersSummary from "../../../hooks/get/fetchEnrolledEmployeeSummary";
import Loader from "../../../components/Loader";
const AdminProgressList = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
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

        const enrolled = await fetchEnrolledUsersSummary(courseId);

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
        <div className="w-full h-full flex flex-row mt-6 px-4  md:px-0 md:pt-0">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between">
              <label className="text-xl font-semibold">
                Employee Progress List
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="px-3 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Employees Table */}
            <div className="w-full mt-5 bg-white shadow-md rounded-lg ">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left">Profile</th>
                    <th className="py-3 px-6 text-left">Course Progress</th>
                    <th className="py-3 px-6 text-left">Scores</th>
                    <th className="py-3 px-6 text-left">Grade</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left"></th>
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
                          <label
                            className={`px-2 py-1 ${
                              employee.TotalEmployeeProgress ===
                              employee.TotalCourseProgress
                                ? "bg-green-200 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {" "}
                            {employee.TotalEmployeeProgress} out of{" "}
                            {employee.TotalCourseProgress} Course Progress
                          </label>
                        </td>
                        <td className="py-3 px-6 text-gray-800">
                          {employee.Score}
                        </td>
                        <td className="py-3 px-6">
                          <label
                            className={`px-2 py-1 rounded-sm ${
                              employee.Grade === "Passing" ||
                              employee.Grade === "Passed"
                                ? "bg-green-200 text-green-600"
                                : employee.Grade === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-200 text-red-600"
                            }`}
                          >
                            {employee.Grade}
                          </label>
                        </td>
                        <td className="py-3 px-6">
                          <label
                            className={`px-2 py-1 rounded-sm ${
                              employee.Status === "Completed"
                                ? "bg-green-200 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {" "}
                            {employee.Status}
                          </label>
                        </td>
                        <td className="py-3 px-6 text-gray-800">
                          <Link
                            to={`/acourse/${courseId}/progress/${employee.UserID}`}
                          >
                            View
                          </Link>
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
    </div>
  );
};

export default AdminProgressList;
