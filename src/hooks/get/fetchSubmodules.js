import { db } from "../../config/firebaseConfigs"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetches all submodules for a specific module inside a course.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module.
 * @returns {Promise<Array>} - A list of submodules.
 */
const fetchSubmodules = async (courseId, moduleId) => {
  try {
    // Reference the "Submodules" subcollection inside the given module document
    const submodulesRef = collection(
      db,
      "Course",
      courseId,
      "Modules",
      moduleId,
      "Submodules"
    );

    // Fetch all documents inside the "Submodules" subcollection
    const querySnapshot = await getDocs(submodulesRef);

    // Map through results and return submodule data
    const submodules = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched Submodules:", submodules);
    return submodules;
  } catch (error) {
    console.error("Error fetching submodules:", error);
    throw error;
  }
};

export default fetchSubmodules;
