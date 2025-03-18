import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdViewModule } from "react-icons/md";
import { MdAddTask } from "react-icons/md";
import { GiProgression } from "react-icons/gi";

const CourseSidebar = ({ userData }) => {
  const { courseId } = useParams();
  useEffect(() => {
    const awaitUserData = async () => {
      if (!userData) {
        return;
      }
    };

    awaitUserData();
  }, [userData]);

  return (
    <>
      <div
        className={`md:flex fixed md:relative ${
          userData?.UserRole === "Admin" || userData.UserRole === "Trainor"
            ? "md:bottom-0 bottom-16 md:py-0 p-2"
            : "bottom-0"
        }  md:w-auto w-full flex-row gap-4 items-center bg-[#f8f4fc] md:bg-transparent`}
      >
        {userData?.UserRole === "Employee" ? (
          <>
            {/*Web Screen Responsive*/}
            <div className="flex-row gap-4 justify-center md:flex hidden">
              <Link to={`/course/${courseId}`}>
                <div className=" flex flex-row items-center">
                  <label className="cursor-pointer text-sm text-[#152852] underline">
                    Home
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/modules`}>
                <div className=" flex flex-row items-center">
                  <label className="cursor-pointer text-sm text-[#152852] underline">
                    Modules
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/tasks`}>
                <div className=" flex flex-row items-center">
                  <label className="cursor-pointer text-sm text-[#152852] underline">
                    Tasks
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/progress`}>
                <div className=" flex flex-row items-center">
                  <label className="cursor-pointer text-sm text-[#152852] underline">
                    Progress
                  </label>
                </div>
              </Link>
            </div>
            {/*Mobile Screen Responsive*/}
            <div className="md:hidden flex-row gap-8 justify-center flex z-10 py-2 ">
              <Link to={`/course/${courseId}`}>
                <div className=" flex flex-col items-center justify-between">
                  <FaHome className="w-6 h-6 " />
                  <label className="cursor-pointer text-sm text-[#152852]">
                    Home
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/modules`}>
                <div className=" flex flex-col items-center justify-between">
                  <MdViewModule className="w-6 h-6" />
                  <label className="cursor-pointer text-sm text-[#152852]">
                    Modules
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/tasks`}>
                <div className=" flex flex-col items-center justify-between">
                  <MdAddTask className="w-6 h-6" />
                  <label className="cursor-pointer text-sm text-[#152852]">
                    Tasks
                  </label>
                </div>
              </Link>
              <Link to={`/course/${courseId}/progress`}>
                <div className=" flex flex-col items-center justify-between">
                  <GiProgression className="w-6 h-6" />
                  <label className="cursor-pointer text-sm text-[#152852]">
                    Progress
                  </label>
                </div>
              </Link>
            </div>
          </>
        ) : userData?.UserRole === "Trainor" ? (
          <>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/${courseId}`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Home
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <Link
                to={`/tcourse/${courseId}/users`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Employees
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/${courseId}/modules`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Modules
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/${courseId}/tasks`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Tasks
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/${courseId}/progress`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Progress
              </Link>
            </div>
          </>
        ) : userData?.UserRole === "Admin" ? (
          <>
            {/*Web Screen Responsive*/}
            <div className="flex-row gap-4 justify-center md:flex hidden">
              <div className="md:flex hidden flex-row items-center">
                <Link
                  to={`/acourse/${courseId}`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Home
                </Link>
              </div>
              <div className="flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/users`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Employees
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/modules`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Modules
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/tasks`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Tasks
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/progress`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Progress
                </Link>
              </div>
            </div>

            {/*Mobile Screen Responsive*/}
            <div className="md:hidden flex-row gap-8 justify-center flex z-10 py-2">
              <div className="md:flex hidden flex-row items-center">
                <Link
                  to={`/acourse/${courseId}`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Home
                </Link>
              </div>
              <div className="flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/users`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Employees
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/modules`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Modules
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/tasks`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Tasks
                </Link>
              </div>
              <div className=" flex flex-row items-center">
                <Link
                  to={`/acourse/${courseId}/progress`}
                  className="cursor-pointer text-sm text-[#152852] underline"
                >
                  Progress
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default CourseSidebar;
