import { db } from "../../config/firebaseConfigs";
import { doc, deleteDoc } from "firebase/firestore";

const removeEnrolledEmployee = async (enrolledId) => {
  try {
    const enrolledRef = doc(db, "Enrolled", enrolledId);
    await deleteDoc(enrolledRef);
    return true;
  } catch (error) {
    console.error("Error removing employee:", error);
    return false;
  }
};

export default removeEnrolledEmployee;
