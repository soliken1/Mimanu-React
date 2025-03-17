import { db } from "../../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total enrollments and new enrollments for the past 24 hours or 7 days,
 * filtered by a specific trainer's courses.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @param {string} trainerId - The trainer's user ID to filter relevant courses.
 * @returns {Promise<{ totalEnrolled: number, newEnrollments: number, percentageChange: string }>}
 */
const fetchEnrollmentCountComparison = async (timeRange, trainerId) => {
  try {
    // ✅ Fetch courses belonging to the trainer
    const coursesRef = collection(db, "Course");
    const trainerCoursesQuery = query(
      coursesRef,
      where("UID", "==", trainerId)
    );
    const trainerCoursesSnapshot = await getDocs(trainerCoursesQuery);

    if (trainerCoursesSnapshot.empty) {
      return { totalEnrolled: 0, newEnrollments: 0, percentageChange: "0%" };
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

    // ✅ Get total enrollments
    const totalEnrolled = enrolledDocs.length;

    // ✅ Get timestamp for selected time range
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "24h") {
      pastTime.setHours(now.getHours() - 24); // Past 24 hours
    } else {
      pastTime.setDate(now.getDate() - 7); // Past 7 days
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Get new enrollments within selected time range
    const timeRangeQuery = query(
      enrolledRef,
      where("DateEnrolled", ">=", pastTimestamp)
    );
    const timeRangeSnapshot = await getDocs(timeRangeQuery);
    const newEnrollments = timeRangeSnapshot.size;

    // ✅ Calculate percentage change relative to previous total enrollments
    const previousTotalEnrolled = totalEnrolled - newEnrollments;
    const percentageChange =
      previousTotalEnrolled > 0
        ? (newEnrollments / previousTotalEnrolled).toFixed(2) * 100 + "%"
        : "0%";

    return { totalEnrolled, newEnrollments, percentageChange };
  } catch (error) {
    console.error("Error fetching enrollment count comparison:", error);
    return { totalEnrolled: 0, newEnrollments: 0, percentageChange: "0%" };
  }
};

export default fetchEnrollmentCountComparison;
