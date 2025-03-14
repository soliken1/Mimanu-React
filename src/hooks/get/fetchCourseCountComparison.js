import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total courses and today's new courses count.
 * @returns {Promise<{ totalCourses: number, change: number, percentageChange: string }>}
 */
const fetchCourseCountComparison = async () => {
  try {
    const coursesRef = collection(db, "Course");

    // ✅ Get total courses in the database (all-time count)
    const allCoursesSnapshot = await getDocs(coursesRef);
    const totalCourses = allCoursesSnapshot.size;

    // ✅ Get the start of today using Firestore's Timestamp
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(startOfToday); // ✅ Firestore Timestamp

    // ✅ Query courses created *today only*
    const todayQuery = query(
      coursesRef,
      where("CreatedAt", ">=", todayTimestamp) // ✅ Direct Firestore Timestamp comparison
    );
    const todaySnapshot = await getDocs(todayQuery);
    const todayNewCourses = todaySnapshot.size; // ✅ Number of new courses today

    // ✅ Calculate percentage change relative to previous total courses
    const previousTotalCourses = totalCourses - todayNewCourses;
    const percentageChange =
      previousTotalCourses > 0
        ? ((todayNewCourses / previousTotalCourses) * 100).toFixed(2) + "%"
        : "0%";

    return { totalCourses, change: todayNewCourses, percentageChange };
  } catch (error) {
    console.error("Error fetching course count comparison:", error);
    return { totalCourses: 0, change: 0, percentageChange: "0%" };
  }
};

export default fetchCourseCountComparison;
