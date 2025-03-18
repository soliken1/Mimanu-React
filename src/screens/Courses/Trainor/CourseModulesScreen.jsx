import React, { useEffect, useState } from "react";
import fetchUser from "../../../hooks/get/fetchUser";
import NavSidebar from "../../../components/NavSidebar";
import { useParams } from "react-router-dom";
import fetchCourse from "../../../hooks/get/fetchCourse";
import { Link } from "react-router-dom";
import CourseSidebar from "../../../components/CourseSidebar";
import AddModuleModal from "../../../components/AddModuleModal";
import fetchModules from "../../../hooks/get/fetchModulesandSubmodules";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import deleteModule from "../../../hooks/delete/removeModule";
import AddSubmoduleModal from "../../../components/AddSubmoduleModal";
import deleteSubmodule from "../../../hooks/delete/removeSubmodule";
import { MdLibraryBooks } from "react-icons/md";
import Loader from "../../../components/Loader";

const TCourseModules = ({ getUser }) => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [isSubmoduleModalOpen, setIsSubmoduleModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const course = await fetchCourse(courseId);
        setCourseData(course);

        const modules = await fetchModules(courseId);
        setModules(modules);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteModule = async (moduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (!confirmDelete) return;

    const isDeleted = await deleteModule(courseId, moduleId);
    if (isDeleted) {
      setModules(modules.filter((module) => module.id !== moduleId));
    }
  };

  const handleDeleteSubmodule = async (moduleId, submoduleId) => {
    if (!window.confirm("Are you sure you want to delete this submodule?"))
      return;

    try {
      await deleteSubmodule(courseId, moduleId, submoduleId);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                submodules: module.submodules.filter(
                  (sub) => sub.id !== submoduleId
                ),
              }
            : module
        )
      );
    } catch (error) {
      console.error("Error deleting submodule:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div class="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full flex flex-col gap-2 md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <label className="text-xl font-semibold">
              {courseData?.CourseTitle}
            </label>
            <label className="text-sm text-gray-600">
              {courseData?.CourseDescription}
            </label>
          </div>
          <CourseSidebar userData={userData} />
        </div>
        <div className="w-full h-full flex flex-col mt-6">
          <div className="flex justify-between">
            <label className="text-xl font-semibold">Course Modules</label>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#152852] px-4 cursor-pointer text-white rounded-lg py-2"
            >
              Add Module
            </button>
          </div>
          <div className="w-9/12 h-auto flex flex-col gap-12 mt-5">
            {modules.length > 0 ? (
              modules.map((module) => (
                <div
                  className=" rounded-md border-gray-300 border-t border-s border-r"
                  key={module.id}
                >
                  {/* MODULE HEADER */}
                  <div className="flex flex-row justify-between p-4 bg-gray-200">
                    <div className="flex gap-2 items-center">
                      <IoMdArrowDropdown />
                      <label className="font-semibold">
                        {module.ModuleTitle}
                      </label>
                    </div>
                    <div className="flex gap-4 items-center">
                      <IoAddCircleSharp
                        onClick={() => {
                          setSelectedModuleId(module.id);
                          setIsSubmoduleModalOpen(true);
                        }}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                      />
                      <MdDelete
                        onClick={() => handleDeleteModule(module.id)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </div>
                  </div>

                  {/* SUBMODULE LIST */}
                  <div className="">
                    {module.submodules.length > 0 ? (
                      module.submodules.map((submodule) => (
                        <div
                          key={submodule.id}
                          className="flex justify-between items-center bg-gray-100 border-b border-gray-300 hover:bg-gray-300"
                        >
                          <Link
                            to={`/tcourse/${courseId}/modules/${module.id}/submodules/${submodule.id}`}
                            className="w-full p-4 flex flex-row gap-2 items-center"
                          >
                            <MdLibraryBooks />
                            {submodule.SubmoduleTitle}
                          </Link>
                          <MdDelete
                            onClick={() =>
                              handleDeleteSubmodule(module.id, submodule.id)
                            }
                            className=" cursor-pointer me-4 text-red-500 hover:text-red-700"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 p-3">
                        No Submodules Yet.
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 w-full text-center ">
                No Modules Yet, Add A Module!
              </div>
            )}
          </div>
        </div>
      </div>

      <AddSubmoduleModal
        isOpen={isSubmoduleModalOpen}
        onClose={() => setIsSubmoduleModalOpen(false)}
        courseId={courseId}
        moduleId={selectedModuleId}
      />

      <AddModuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TCourseModules;
