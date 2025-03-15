import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches total user count and new users for a specific time range (past 24 hours or 7 days).
 * @param {"24h" | "7d"} timeRange - The selected time range.
 * @returns {Promise<{ totalUsers: number, newUsers: number, percentageChange: string }>}
 */
const fetchUserCountComparison = async (timeRange) => {
  try {
    const usersRef = collection(db, "Users");

    // ✅ Get total users in the database (all-time count)
    const allUsersSnapshot = await getDocs(usersRef);
    const totalUsers = allUsersSnapshot.size;

    // ✅ Get the timestamp for the selected range
    const now = new Date();
    let pastTime = new Date();

    if (timeRange === "24h") {
      pastTime.setHours(now.getHours() - 24); // Past 24 hours
    } else {
      pastTime.setDate(now.getDate() - 7); // Past 7 days
    }

    const pastTimestamp = Timestamp.fromDate(pastTime); // ✅ Firestore Timestamp

    // ✅ Query users created *within the selected time range*
    const timeRangeQuery = query(
      usersRef,
      where("CreatedAt", ">=", pastTimestamp)
    );
    const timeRangeSnapshot = await getDocs(timeRangeQuery);
    const newUsers = timeRangeSnapshot.size; // ✅ Count new users

    // ✅ Calculate percentage change relative to previous total users
    const previousTotalUsers = totalUsers - newUsers;
    const percentageChange =
      previousTotalUsers > 0
        ? (newUsers / previousTotalUsers) * 100 + "%"
        : "0%";
    console.log(percentageChange);
    return { totalUsers, newUsers, percentageChange };
  } catch (error) {
    console.error("Error fetching user count comparison:", error);
    return { totalUsers: 0, newUsers: 0, percentageChange: "0%" };
  }
};

export default fetchUserCountComparison;
