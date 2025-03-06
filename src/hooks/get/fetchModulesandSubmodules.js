import { db } from "../../config/firebaseConfigs";
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetches all modules and their submodules for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} - A list of modules with their submodules.
 */
const fetchModulesWithSubmodules = async (courseId) => {
  try {
    const modulesRef = collection(db, "Course", courseId, "Modules");
    const modulesSnapshot = await getDocs(modulesRef);

    const modules = await Promise.all(
      modulesSnapshot.docs.map(async (moduleDoc) => {
        const moduleData = { id: moduleDoc.id, ...moduleDoc.data() };

        // Fetch Submodules inside each Module
        const submodulesRef = collection(
          db,
          "Course",
          courseId,
          "Modules",
          moduleDoc.id,
          "Submodules"
        );
        const submodulesSnapshot = await getDocs(submodulesRef);
        const submodules = submodulesSnapshot.docs.map((subDoc) => ({
          id: subDoc.id,
          ...subDoc.data(),
        }));

        return { ...moduleData, submodules }; // Attach submodules to the module
      })
    );

    return modules;
  } catch (error) {
    console.error("Error fetching modules with submodules:", error);
    throw error;
  }
};

export default fetchModulesWithSubmodules;
