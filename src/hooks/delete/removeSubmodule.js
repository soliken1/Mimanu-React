import { db } from "../../config/firebaseConfigs"; // Firestore instance
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Deletes a submodule inside a specific module.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module.
 * @param {string} submoduleId - The ID of the submodule to delete.
 */
const deleteSubmodule = async (courseId, moduleId, submoduleId) => {
  try {
    const submoduleRef = doc(
      db,
      "Course",
      courseId,
      "Modules",
      moduleId,
      "Submodules",
      submoduleId
    );
    await deleteDoc(submoduleRef);
    console.log("Submodule deleted successfully:", submoduleId);
  } catch (error) {
    console.error("Error deleting submodule:", error);
    throw error;
  }
};

export default deleteSubmodule;
