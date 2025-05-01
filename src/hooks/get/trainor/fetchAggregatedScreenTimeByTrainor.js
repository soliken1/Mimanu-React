import { db } from "../../../config/firebaseConfigs";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches screen time data only for users enrolled in courses owned by a specific trainor.
 * @param {string} trainorUID - The UID of the trainor.
 * @returns {Promise<Array<{ userId: string, name: string, profile: string, totalDuration: number, screenTimeEntries: Array<Object> }>>}
 */
const fetchAggregatedScreenTimeByTrainor = async (trainorUID) => {
  try {
    // Step 1: Get all courses owned by the trainor
    const courseRef = collection(db, "Course");
    const courseQuery = query(courseRef, where("UID", "==", trainorUID));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) return [];

    const courseIDs = courseSnapshot.docs.map((doc) => doc.id);

    // Step 2: Get all enrolled documents
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);
    const enrolledDocs = enrolledSnapshot.docs;

    const screenTimeMap = {};

    for (const enrolledDoc of enrolledDocs) {
      const enrolledData = enrolledDoc.data();
      const { UserID, CourseID } = enrolledData;

      // ✅ Skip if not part of this trainor's courses
      if (!UserID || !courseIDs.includes(CourseID)) continue;

      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );
      const screenTimeSnapshot = await getDocs(screenTimeRef);

      if (!screenTimeMap[UserID]) {
        screenTimeMap[UserID] = {
          userId: UserID,
          totalDuration: 0,
          screenTimeEntries: [],
        };
      }

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

    // ✅ Convert to array and sort
    let aggregatedScreenTime = Object.values(screenTimeMap).sort(
      (a, b) => b.totalDuration - a.totalDuration
    );

    // ✅ Fetch user details
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
    console.error("Error fetching screen time by trainor:", error);
    return [];
  }
};

export default fetchAggregatedScreenTimeByTrainor;
