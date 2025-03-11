import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchEnrolledId = async (userId, courseId) => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const q = query(
      enrolledRef,
      where("UserID", "==", userId),
      where("CourseID", "==", courseId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming there's only one document per User-Course combination
      const enrolledDoc = querySnapshot.docs[0];
      return enrolledDoc.id;
    }

    return null; // Return null if no matching enrollment found
  } catch (error) {
    console.error("Error fetching enrolled ID:", error);
    return null;
  }
};

export default fetchEnrolledId;
