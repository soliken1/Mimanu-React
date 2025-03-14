import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total user count and today's new users count.
 * @returns {Promise<{ totalUsers: number, change: number, percentageChange: string }>}
 */
const fetchUserCountComparison = async () => {
  try {
    const usersRef = collection(db, "Users");

    // ✅ Get total users in the database (all-time count)
    const allUsersSnapshot = await getDocs(usersRef);
    const totalUsers = allUsersSnapshot.size;

    // ✅ Get the start of today as a Firestore Timestamp
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(startOfToday); // ✅ Firestore Timestamp

    // ✅ Query users created *today only*
    const todayQuery = query(
      usersRef,
      where("CreatedAt", ">=", todayTimestamp)
    );
    const todaySnapshot = await getDocs(todayQuery);
    const todayNewUsers = todaySnapshot.size; // ✅ Number of new users added today

    // ✅ Calculate percentage change relative to the total users before today
    const previousTotalUsers = totalUsers - todayNewUsers;
    const percentageChange =
      previousTotalUsers > 0
        ? ((todayNewUsers / previousTotalUsers) * 100).toFixed(2) + "%"
        : "0%";

    return { totalUsers, change: todayNewUsers, percentageChange };
  } catch (error) {
    console.error("Error fetching user count comparison:", error);
    return { totalUsers: 0, change: 0, percentageChange: "0%" };
  }
};

export default fetchUserCountComparison;
