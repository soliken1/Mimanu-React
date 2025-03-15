import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total enrollments and new enrollments for the past 24 hours or 7 days.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @returns {Promise<{ totalEnrolled: number, newEnrollments: number, percentageChange: string }>}
 */
const fetchEnrollmentCountComparison = async (timeRange) => {
  try {
    const enrolledRef = collection(db, "Enrolled");

    // ✅ Get total enrollments (all-time count)
    const allEnrolledSnapshot = await getDocs(enrolledRef);
    const totalEnrolled = allEnrolledSnapshot.size;

    // ✅ Get the timestamp for the selected time range
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "24h") {
      pastTime.setHours(now.getHours() - 24); // Past 24 hours
    } else {
      pastTime.setDate(now.getDate() - 7); // Past 7 days
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Query enrollments created *within the selected time range*
    const timeRangeQuery = query(
      enrolledRef,
      where("DateEnrolled", ">=", pastTimestamp)
    );
    const timeRangeSnapshot = await getDocs(timeRangeQuery);
    const newEnrollments = timeRangeSnapshot.size; // ✅ Count new enrollments

    // ✅ Calculate percentage change relative to previous total enrollments
    const previousTotalEnrolled = totalEnrolled - newEnrollments;
    const percentageChange =
      previousTotalEnrolled > 0
        ? (newEnrollments / previousTotalEnrolled) * 100 + "%"
        : "0%";

    return { totalEnrolled, newEnrollments, percentageChange };
  } catch (error) {
    console.error("Error fetching enrollment count comparison:", error);
    return { totalEnrolled: 0, newEnrollments: 0, percentageChange: "0%" };
  }
};

export default fetchEnrollmentCountComparison;
