import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches total enrollments and today's new enrollments count.
 * @returns {Promise<{ totalEnrolled: number, change: number, percentageChange: string }>}
 */
const fetchEnrollmentCountComparison = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");

    // ✅ Get total enrollments in the database (all-time count)
    const allEnrolledSnapshot = await getDocs(enrolledRef);
    const totalEnrolled = allEnrolledSnapshot.size;

    // ✅ Get the start of today
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // ✅ Convert to Firestore timestamp
    const todayTimestamp = Math.floor(startOfToday.getTime() / 1000);

    // ✅ Query enrollments created *today only*
    const todayQuery = query(
      enrolledRef,
      where("DateEnrolled.seconds", ">=", todayTimestamp)
    );
    const todaySnapshot = await getDocs(todayQuery);
    const todayNewEnrollments = todaySnapshot.size; // ✅ Number of new enrollments today

    // ✅ Calculate percentage change relative to previous total enrollments
    const previousTotalEnrolled = totalEnrolled - todayNewEnrollments;
    const percentageChange =
      previousTotalEnrolled > 0
        ? ((todayNewEnrollments / previousTotalEnrolled) * 100).toFixed(2) + "%"
        : "0%";

    return { totalEnrolled, change: todayNewEnrollments, percentageChange };
  } catch (error) {
    console.error("Error fetching enrollment count comparison:", error);
    return { totalEnrolled: 0, change: 0, percentageChange: "0%" };
  }
};

export default fetchEnrollmentCountComparison;
