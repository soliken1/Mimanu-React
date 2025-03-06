import { db } from "../../config/firebaseConfigs"; // Import Firestore instance
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Function to delete a module from a course's subcollection in Firestore.
 * @param {string} courseId - The ID of the course containing the module.
 * @param {string} moduleId - The ID of the module to delete.
 */
const deleteModule = async (courseId, moduleId) => {
  try {
    // Reference the specific module document inside the course's subcollection
    const moduleRef = doc(db, "Course", courseId, "Modules", moduleId);

    // Delete the module document
    await deleteDoc(moduleRef);

    console.log(`Module ${moduleId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting module:", error);
    return false;
  }
};

export default deleteModule;
