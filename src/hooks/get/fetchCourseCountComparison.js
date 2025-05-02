import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total courses and new courses for the past 24 hours or 7 days.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @returns {Promise<{ totalCourses: number, newCourses: number, percentageChange: string }>}
 */
const fetchCourseCountComparison = async (timeRange) => {
  try {
    const coursesRef = collection(db, "Course");

    // ✅ Get total courses (all-time count)
    const allCoursesSnapshot = await getDocs(coursesRef);
    const totalCourses = allCoursesSnapshot.size;

    // ✅ Get the timestamp for the selected time range
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "7d") {
      pastTime.setDate(now.getDate() - 7); // Past 7 days
    } else if (timeRange === "30d") {
      pastTime.setDate(now.getDate() - 30); // This Month
    } else {
      pastTime.setHours(now.getHours() - 24); // Past 24 hours
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Query courses created *within the selected time range*
    const timeRangeQuery = query(
      coursesRef,
      where("CreatedAt", ">=", pastTimestamp)
    );
    const timeRangeSnapshot = await getDocs(timeRangeQuery);
    const newCourses = timeRangeSnapshot.size; // ✅ Count new courses

    // ✅ Calculate percentage change relative to previous total courses
    const previousTotalCourses = totalCourses - newCourses;
    const percentageChange =
      previousTotalCourses > 0
        ? (newCourses / previousTotalCourses).toFixed(2) * 100 + "%"
        : "0%";

    return { totalCourses, newCourses, percentageChange };
  } catch (error) {
    console.error("Error fetching course count comparison:", error);
    return { totalCourses: 0, newCourses: 0, percentageChange: "0%" };
  }
};

export default fetchCourseCountComparison;
