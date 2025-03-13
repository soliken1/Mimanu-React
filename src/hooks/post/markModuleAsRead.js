import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Marks a submodule as read and checks if the module should be marked as completed.
 * @param {string} enrolledId - The enrolled document ID of the user.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module.
 */
export const markModuleAsRead = async (enrolledId, courseId, moduleId) => {
  try {
    // Fetch all submodules in the module
    const submodulesRef = collection(
      db,
      "Course",
      courseId,
      "Modules",
      moduleId,
      "Submodules"
    );
    const submodulesSnapshot = await getDocs(submodulesRef);

    const totalSubmodules = submodulesSnapshot.docs.length;

    // Fetch all read submodules for the user
    const completedSubmodulesRef = collection(
      db,
      "Enrolled",
      enrolledId,
      "CompletedSubmodule"
    );
    const completedSubmodulesSnapshot = await getDocs(completedSubmodulesRef);

    // Count how many submodules in this module are completed
    const completedSubmoduleIds = completedSubmodulesSnapshot.docs.map(
      (doc) => doc.id
    );
    const readSubmodules = submodulesSnapshot.docs.filter((sub) =>
      completedSubmoduleIds.includes(sub.id)
    ).length;

    // If all submodules are completed, mark the module as completed
    if (readSubmodules === totalSubmodules) {
      const completedModuleRef = doc(
        db,
        "Enrolled",
        enrolledId,
        "CompletedModule",
        moduleId
      );
      await setDoc(completedModuleRef, {
        Completed: true,
        CompletedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error marking submodule as read:", error);
  }
};
