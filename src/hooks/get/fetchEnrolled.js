import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchEnrolled = async (userId, courseId) => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const q = query(
      enrolledRef,
      where("UserID", "==", userId),
      where("CourseID", "==", courseId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const enrolledDoc = querySnapshot.docs[0];
      const enrolledData = { id: enrolledDoc.id, ...enrolledDoc.data() };

      // Fetch the "ScreenTask" subcollection
      const screenTimeRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "ScreenTime"
      );
      const screenTimeSnapshot = await getDocs(screenTimeRef);

      // Extract data from "ScreenTask" documents
      const screenTimekData = screenTimeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Include ScreenTask data in the returned object
      return {
        id: enrolledDoc.id,
        ...enrolledData,
        ScreenTime: screenTimekData,
      };
    }

    return null; // Return null if no matching enrollment found
  } catch (error) {
    console.error("Error fetching enrolled data:", error);
    return null;
  }
};

export default fetchEnrolled;
