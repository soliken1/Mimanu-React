import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

/**
 * Fetches all ScreenTime records for all enrolled users.
 * @returns {Promise<Array<{ id: string, UserID: string, CourseID: string, Screen: string, Duration: number }>>}
 */
const fetchAllScreenTimeData = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);

    if (enrolledSnapshot.empty) {
      return []; // No enrolled users found
    }

    let allScreenTimeEntries = [];

    // Iterate through all enrolled users
    for (const enrolledDoc of enrolledSnapshot.docs) {
      const enrolledData = enrolledDoc.data(); // Get UserID and CourseID if needed
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );
      const screenTimeSnapshot = await getDocs(screenTimeRef);

      if (!screenTimeSnapshot.empty) {
        const screenTimeEntries = screenTimeSnapshot.docs.map((screenDoc) => ({
          id: screenDoc.id,
          UserID: enrolledData.UserID, // Include UserID
          CourseID: enrolledData.CourseID, // Include CourseID
          ...screenDoc.data(),
        }));

        allScreenTimeEntries = allScreenTimeEntries.concat(screenTimeEntries);
      }
    }

    return allScreenTimeEntries;
  } catch (error) {
    console.error("Error fetching all ScreenTime data:", error);
    return [];
  }
};

export default fetchAllScreenTimeData;
