import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

/**
 * Fetches screen time data for the past 24 hours or 7 days.
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @returns {Promise<Array<Object>>} - Data formatted for Recharts.
 */
const fetchTopScreenTimeActions = async (timeRange) => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);
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
      ); // ✅ Direct Firestore Query
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
    ); // Sort by date
  } catch (error) {
    console.error("Error fetching screen time actions:", error);
    return [];
  }
};

export default fetchTopScreenTimeActions;
