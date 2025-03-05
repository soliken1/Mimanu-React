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
      console.log(userData);
    };

    awaitUserData();
  }, [userData]);
  return (
    <>
      <div className="w-[15vh] flex flex-col gap-2">
        {userData?.UserRole === "Employee" ? (
          <>
            <Link to={`/course/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Home
                </label>
              </div>
            </Link>
            <Link to={`/course/modules/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Modules
                </label>
              </div>
            </Link>
            <Link to={`/course/tasks/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Tasks
                </label>
              </div>
            </Link>
            <Link to={`/course/results/${courseId}`}>
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
                Users
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/modules/${courseId}`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Modules
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/tasks/${courseId}`}
                className="cursor-pointer text-sm text-[#152852] underline"
              >
                Tasks
              </Link>
            </div>
            <div className=" flex flex-row items-center">
              <Link
                to={`/tcourse/results/${courseId}`}
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
