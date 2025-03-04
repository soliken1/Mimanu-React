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
            <Link to={`/tcourse/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Home
                </label>
              </div>
            </Link>
            <Link to={`/tcourse/users/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Users
                </label>
              </div>
            </Link>
            <Link to={`/tcourse/modules/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Modules
                </label>
              </div>
            </Link>
            <Link to={`/tcourse/tasks/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Tasks
                </label>
              </div>
            </Link>
            <Link to={`/tcourse/results/${courseId}`}>
              <div className=" flex flex-row items-center">
                <label className="cursor-pointer text-sm text-[#152852] underline">
                  Result
                </label>
              </div>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
};

export default CourseSidebar;
