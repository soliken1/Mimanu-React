import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches all ScreenTime data, aggregates it per user (UserID), binds user details, and sorts by total duration.
 * @returns {Promise<Array<{ userId: string, name: string, profile: string, totalDuration: number, screenTimeEntries: Array<Object> }>>}
 */
const fetchAggregatedScreenTime = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);
    const enrolledDocs = enrolledSnapshot.docs;

    const screenTimeMap = {}; // Store aggregated screen time by userId

    // ✅ Loop through each enrolled employee
    for (const enrolledDoc of enrolledDocs) {
      const enrolledData = enrolledDoc.data();
      const { UserID } = enrolledData;

      if (!UserID) continue; // Skip if UserID is missing

      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );

      // ✅ Fetch screen time data
      const screenTimeSnapshot = await getDocs(screenTimeRef);

      if (!screenTimeMap[UserID]) {
        screenTimeMap[UserID] = {
          userId: UserID,
          totalDuration: 0,
          screenTimeEntries: [],
        };
      }

      // ✅ Aggregate screen time per user
      screenTimeSnapshot.docs.forEach((screenDoc) => {
        const { Duration, Timestamp, Screen } = screenDoc.data();

        if (Duration === undefined) return;

        screenTimeMap[UserID].totalDuration += Duration;
        screenTimeMap[UserID].screenTimeEntries.push({
          screen: Screen,
          duration: Duration,
          timestamp: Timestamp.toDate().toISOString(),
        });
      });
    }

    // ✅ Convert object to array and sort by totalDuration DESC
    let aggregatedScreenTime = Object.values(screenTimeMap).sort(
      (a, b) => b.totalDuration - a.totalDuration
    );

    // ✅ Fetch user details (Name & Profile)
    for (let user of aggregatedScreenTime) {
      const userRef = collection(db, "Users");
      const userQuery = query(userRef, where("UID", "==", user.userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        user.name = userData.Username || "Unknown User";
        user.profile = userData.UserImg || "";
      } else {
        user.name = "Unknown User";
        user.profile = "";
      }
    }

    return aggregatedScreenTime;
  } catch (error) {
    console.error("Error fetching aggregated screen time:", error);
    return [];
  }
};

export default fetchAggregatedScreenTime;
