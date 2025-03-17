import { db } from "../../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total Employee Actions (ScreenTime) and new actions for the past 24 hours or 7 days,
 * filtered by a specific trainer's courses.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @param {string} trainerId - The trainer's user ID to filter relevant courses.
 * @returns {Promise<{ totalActions: number, newActions: number, percentageChange: string }>}
 */
const fetchEmployeeActions = async (timeRange, trainerId) => {
  try {
    // ✅ Fetch courses belonging to the trainer
    const coursesRef = collection(db, "Course");
    const trainerCoursesQuery = query(
      coursesRef,
      where("UID", "==", trainerId)
    );
    const trainerCoursesSnapshot = await getDocs(trainerCoursesQuery);

    if (trainerCoursesSnapshot.empty) {
      return { totalActions: 0, newActions: 0, percentageChange: "0%" };
    }

    const trainerCourseIds = trainerCoursesSnapshot.docs.map((doc) => doc.id);

    // ✅ Fetch Enrolled documents linked to the trainer's courses
    const enrolledRef = collection(db, "Enrolled");
    const enrolledQuery = query(
      enrolledRef,
      where("CourseID", "in", trainerCourseIds)
    );
    const enrolledSnapshot = await getDocs(enrolledQuery);
    const enrolledDocs = enrolledSnapshot.docs;

    let totalActions = 0;
    let newActions = 0;

    // ✅ Get timestamp for selected time range
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "24h") {
      pastTime.setHours(now.getHours() - 24); // Past 24 hours
    } else {
      pastTime.setDate(now.getDate() - 7); // Past 7 days
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Loop through each Enrolled document
    for (const enrolledDoc of enrolledDocs) {
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );

      // ✅ Get total actions
      const screenTimeSnapshot = await getDocs(screenTimeRef);
      totalActions += screenTimeSnapshot.size;

      // ✅ Get new actions within selected time range
      const timeRangeQuery = query(
        screenTimeRef,
        where("Timestamp", ">=", pastTimestamp)
      );
      const timeRangeSnapshot = await getDocs(timeRangeQuery);
      newActions += timeRangeSnapshot.size;
    }

    // ✅ Calculate percentage change
    const previousTotalActions = totalActions - newActions;
    const percentageChange =
      previousTotalActions > 0
        ? (newActions / previousTotalActions).toFixed(2) * 100 + "%"
        : "0%";

    return { totalActions, newActions, percentageChange };
  } catch (error) {
    console.error("Error fetching employee actions:", error);
    return { totalActions: 0, newActions: 0, percentageChange: "0%" };
  }
};

export default fetchEmployeeActions;
