import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
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
      <div className="flex flex-row gap-4 items-center">
        {userData?.UserRole === "Employee" ? (
          <>
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
            <Link to={`/course/${courseId}/results`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Result
                </label>
              </div>
            </Link>
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
                to={`/tcourse/${courseId}/results`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Result
              </Link>
            </div>
          </>
        ) : userData?.UserRole === "Admin" ? (
          <>
            <div className=" flex flex-row items-center">
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
                to={`/acourse/${courseId}/results`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Result
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default CourseSidebar;
