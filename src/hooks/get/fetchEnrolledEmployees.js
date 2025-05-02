import { db } from "../../config/firebaseConfigs";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const fetchEnrolledEmployees = async (courseID) => {
  try {
    // Fetch enrolled employees for the given course
    const enrolledRef = collection(db, "Enrolled");
    const q = query(enrolledRef, where("CourseID", "==", courseID));
    const querySnapshot = await getDocs(q);

    // Extract enrolled employee IDs
    const enrolledEmployees = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch employee details from "Users" collection
    const employeesWithDetails = await Promise.all(
      enrolledEmployees.map(async (enrolled) => {
        const userRef = doc(db, "Users", enrolled.UserID);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return {
            id: enrolled.id,
            UserID: enrolled.UserID,
            Status: enrolled.Status,
            FirstName: userSnap.data().FirstName,
            LastName: userSnap.data().LastName,
            Email: userSnap.data().Email,
            UserImg: userSnap.data().UserImg, // If you have profile images
            DateEnrolled: enrolled.DateEnrolled,
          };
        } else {
          return null; // If user not found
        }
      })
    );

    // Filter out any null values (in case user doesn't exist)
    return employeesWithDetails.filter((employee) => employee !== null);
  } catch (error) {
    console.error("Error fetching enrolled employees:", error);
    return [];
  }
};

export default fetchEnrolledEmployees;
