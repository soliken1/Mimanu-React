import { db } from "../../config/firebaseConfigs";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Updates a specific submodule in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module.
 * @param {string} submoduleId - The ID of the submodule.
 * @param {object} updatedData - The new submodule data.
 */
const updateSubmodule = async (
  courseId,
  moduleId,
  submoduleId,
  updatedData
) => {
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
    await updateDoc(submoduleRef, updatedData);
  } catch (error) {
    console.error("Error updating submodule:", error);
  }
};

export default updateSubmodule;
