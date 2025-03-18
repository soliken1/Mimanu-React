import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfigs";

/**
 * Fetches screen time data for the past 24 hours or 7 days only for the trainer's courses.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @returns {Promise<Array<Object>>} - Data formatted for Recharts.
 */
const fetchTrainorTopScreenTime = async (timeRange) => {
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

    const screenTimeData = {};
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "24h") {
      pastTime.setHours(now.getHours() - 24);
    } else {
      pastTime.setDate(now.getDate() - 7);
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Step 3: Fetch screen time from "ScreenTime" subcollection
    for (const enrolledDoc of enrolledSnapshot.docs) {
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );
      const screenTimeQuery = query(
        screenTimeRef,
        where("Timestamp", ">=", pastTimestamp)
      );
      const screenTimeSnapshot = await getDocs(screenTimeQuery);

      if (!screenTimeSnapshot.empty) {
        screenTimeSnapshot.docs.forEach((screenDoc) => {
          const { Screen, Duration, Timestamp } = screenDoc.data();
          if (Screen && Duration && Timestamp) {
            const timeLabel = Timestamp.toDate().toLocaleDateString(); // ✅ Convert Firestore Timestamp

            if (!screenTimeData[timeLabel])
              screenTimeData[timeLabel] = { time: timeLabel };
            screenTimeData[timeLabel][Screen] =
              (screenTimeData[timeLabel][Screen] || 0) + Duration;
          }
        });
      }
    }

    return Object.values(screenTimeData).sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    ); // ✅ Sort by date
  } catch (error) {
    console.error("Error fetching trainer's screen time:", error);
    return [];
  }
};

export default fetchTrainorTopScreenTime;
