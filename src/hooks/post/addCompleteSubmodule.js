import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs";

const CompletedSubmodules = async (
  courseId,
  moduleId,
  submoduleId,
  enrolledId
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Reference to the CompletedSubmodule document
    const submoduleDocRef = doc(
      db,
      "Enrolled",
      enrolledId,
      "CompletedSubmodule",
      submoduleId
    );

    // Check if the submodule has already been marked as read
    const submoduleSnapshot = await getDoc(submoduleDocRef);
    if (submoduleSnapshot.exists()) {
      return; // Stop execution if already read
    }

    // Mark submodule as read
    await setDoc(submoduleDocRef, {
      courseId,
      moduleId,
      submoduleId,
      hasRead: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error marking submodule as read:", error);
  }
};

export default CompletedSubmodules;
