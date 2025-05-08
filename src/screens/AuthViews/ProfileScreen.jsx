import React, { useEffect, useState } from "react";
import NavSidebar from "../../components/NavSidebar";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebaseConfigs";
import fetchUser from "../../hooks/get/fetchUser";
import HelpButton from "../../components/HelpButton";
import Loader from "../../components/Loader";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const ProfileScreen = ({ getUser }) => {
  const { uid } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const selectedData = await fetchUser(uid);
        setSelectedUser(selectedData);

        const data = await fetchUser(getUser.uid);
        setUserData(data);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchCompletedCourses = async () => {
      try {
        const enrolledRef = collection(db, "Enrolled");
        const q = query(
          enrolledRef,
          where("UserID", "==", uid),
          where("Status", "==", "Completed")
        );
        const querySnapshot = await getDocs(q);

        const coursePromises = querySnapshot.docs.map(async (docSnap) => {
          const courseID = docSnap.data().CourseID;
          console.log(courseID);
          const courseRef = doc(db, "Course", courseID);
          const courseSnap = await getDoc(courseRef);

          if (courseSnap.exists()) {
            return { id: courseID, ...courseSnap.data() };
          }
          return null;
        });

        const courses = (await Promise.all(coursePromises)).filter(
          (course) => course !== null
        );
        setCompletedCourses(courses);
      } catch (err) {
        console.error("Error fetching completed courses:", err);
      }
    };

    fetchCompletedCourses();
    fetchAndSetUserData();
  }, [uid]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full ps-72 h-auto min-h-screen p-12 bg-[#FAF9F6]">
        <div className="h-60 relative bg-amber-100 rounded-lg">
          <div className="w-full justify-between flex flex-row h-auto absolute gap-1 pe-20 bottom-0 left-0 transform translate-x-8 translate-y-28">
            <div className="flex flex-row">
              <img
                className="w-48 h-48 p-1 bg-white rounded-full object-cover"
                src={selectedUser?.UserImg}
              />
              <div className="min-h-full flex items-end">
                <div className="flex flex-col">
                  <label className="text-2xl font-semibold">
                    {selectedUser?.FirstName} {selectedUser?.LastName}
                  </label>
                  <label className="text-lg text-gray-600">
                    @{selectedUser?.Username}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 h-auto min-h-96 text-gray-500 justify-center items-center flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-black">
            Completed Courses
          </h2>
          {completedCourses.length > 0 ? (
            completedCourses.map((course) => (
              <div
                key={course.id}
                className="w-full max-w-2xl bg-white rounded-lg shadow p-5 flex flex-col gap-2 border-l-4"
                style={{ borderColor: course.CourseColor }}
              >
                <h3 className="text-lg font-bold">{course.CourseTitle}</h3>
                <p className="text-sm text-gray-600">
                  {course.CourseDescription}
                </p>
                <p className="text-xs text-gray-400">
                  Completed on:{" "}
                  {course.CreatedAt?.toDate().toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No completed courses yet.</p>
          )}
        </div>
      </div>
      <HelpButton />
    </div>
  );
};

export default ProfileScreen;
