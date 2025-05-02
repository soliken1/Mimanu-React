import { db } from "../../config/firebaseConfigs";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const addEnrolledEmployee = async (userID, courseID) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return { success: false, message: "User is not authenticated" };
  }

  try {
    const enrolledRef = collection(db, "Enrolled");
    await addDoc(enrolledRef, {
      UserID: userID,
      CourseID: courseID,
      DateEnrolled: Timestamp.now(),
      Status: "On-Going",
    });
    return { success: true, message: "Employee enrolled successfully" };
  } catch (error) {
    console.error("Error enrolling employee:", error);
    return { success: false, message: error.message };
  }
};

export default addEnrolledEmployee;
