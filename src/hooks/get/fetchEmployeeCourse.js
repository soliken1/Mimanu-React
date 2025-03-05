import { db } from "../../config/firebaseConfigs";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const fetchEmployeeCourse = async (userID) => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledQuery = query(enrolledRef, where("UserID", "==", userID));
    const enrolledSnapshot = await getDocs(enrolledQuery);

    if (enrolledSnapshot.empty) {
      return [];
    }

    const courses = await Promise.all(
      enrolledSnapshot.docs.map(async (enrolledDoc) => {
        const courseRef = doc(db, "Course", enrolledDoc.data().CourseID);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          return {
            id: courseSnap.id,
            ...courseSnap.data(),
            DateEnrolled: enrolledDoc.data().DateEnrolled,
          };
        }
        return null;
      })
    );

    return courses.filter((course) => course !== null);
  } catch (error) {
    console.error("Error fetching employee courses:", error);
    return [];
  }
};

export default fetchEmployeeCourse;
