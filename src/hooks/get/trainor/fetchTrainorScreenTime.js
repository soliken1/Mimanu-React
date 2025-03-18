import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfigs";

/**
 * Fetches all ScreenTime records only for the trainer's courses.
 * @returns {Promise<Array<{ id: string, UserID: string, CourseID: string, Screen: string, Duration: number }>>}
 */
const fetchTrainerScreenTimeData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // ✅ Step 1: Get all courses owned by the trainer (UID)
    const coursesRef = collection(db, "Course");
    const trainerCoursesQuery = query(coursesRef, where("UID", "==", user.uid));
    const trainerCoursesSnapshot = await getDocs(trainerCoursesQuery);

    if (trainerCoursesSnapshot.empty) return [];

    const trainerCourseIds = trainerCoursesSnapshot.docs.map((doc) => doc.id); // ✅ List of course IDs

    // ✅ Step 2: Get all Enrolled documents for those courses
    const enrolledRef = collection(db, "Enrolled");
    const enrolledQuery = query(
      enrolledRef,
      where("CourseID", "in", trainerCourseIds)
    );
    const enrolledSnapshot = await getDocs(enrolledQuery);

    if (enrolledSnapshot.empty) return [];

    let allScreenTimeEntries = [];

    // ✅ Step 3: Fetch screen time from "ScreenTime" subcollection
    for (const enrolledDoc of enrolledSnapshot.docs) {
      const enrolledData = enrolledDoc.data(); // Get UserID and CourseID
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );
      const screenTimeSnapshot = await getDocs(screenTimeRef);

      if (!screenTimeSnapshot.empty) {
        const screenTimeEntries = screenTimeSnapshot.docs.map((screenDoc) => ({
          id: screenDoc.id,
          UserID: enrolledData.UserID, // Include UserID
          CourseID: enrolledData.CourseID, // Include CourseID
          ...screenDoc.data(),
        }));

        allScreenTimeEntries = allScreenTimeEntries.concat(screenTimeEntries);
      }
    }

    return allScreenTimeEntries;
  } catch (error) {
    console.error("Error fetching trainer's ScreenTime data:", error);
    return [];
  }
};

export default fetchTrainerScreenTimeData;
