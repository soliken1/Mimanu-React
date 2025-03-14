import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total Employee Actions (ScreenTime) and today's new actions.
 * @returns {Promise<{ totalActions: number, change: number, percentageChange: string }>}
 */
const fetchEmployeeActions = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");

    // ✅ Get all Enrolled documents
    const enrolledSnapshot = await getDocs(enrolledRef);
    const enrolledDocs = enrolledSnapshot.docs;

    let totalActions = 0;
    let todayActions = 0;

    // ✅ Get the start of today
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(startOfToday); // Firestore Timestamp

    // ✅ Loop through each Enrolled document
    for (const enrolledDoc of enrolledDocs) {
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );

      // ✅ Check if ScreenTime subcollection exists and fetch documents
      const screenTimeSnapshot = await getDocs(screenTimeRef);
      totalActions += screenTimeSnapshot.size; // Count all actions

      // ✅ Filter for today's actions
      const todayQuery = query(
        screenTimeRef,
        where("Timestamp", ">=", todayTimestamp)
      );
      const todaySnapshot = await getDocs(todayQuery);
      todayActions += todaySnapshot.size; // Count today's actions
    }

    // ✅ Calculate percentage change
    const previousTotalActions = totalActions - todayActions;
    const percentageChange =
      previousTotalActions > 0
        ? ((todayActions / previousTotalActions) * 100).toFixed(2) + "%"
        : "0%";

    return { totalActions, change: todayActions, percentageChange };
  } catch (error) {
    console.error("Error fetching employee actions:", error);
    return { totalActions: 0, change: 0, percentageChange: "0%" };
  }
};

export default fetchEmployeeActions;
