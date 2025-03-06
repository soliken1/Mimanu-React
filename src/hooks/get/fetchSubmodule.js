import { db } from "../../config/firebaseConfigs"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";

/**
 * Fetches a specific submodule from Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module.
 * @param {string} submoduleId - The ID of the submodule.
 * @returns {Promise<Object|null>} - The submodule data or null if not found.
 */
const fetchSubmodule = async (courseId, moduleId, submoduleId) => {
  try {
    // Reference to the specific submodule document
    const submoduleRef = doc(
      db,
      "Course",
      courseId,
      "Modules",
      moduleId,
      "Submodules",
      submoduleId
    );

    // Fetch the document
    const submoduleSnap = await getDoc(submoduleRef);

    if (submoduleSnap.exists()) {
      return { id: submoduleSnap.id, ...submoduleSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching submodule:", error);
    throw error;
  }
};

export default fetchSubmodule;
