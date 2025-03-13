import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

/**
 * Fetches all modules and their submodules for a specific course,
 * while also checking if the user has read each submodule.
 * @param {string} courseId - The ID of the course.
 * @param {string} enrolledId - The enrolled document ID of the user.
 * @returns {Promise<Array>} - A list of modules with their submodules and read status.
 */
export const fetchModulesWithReadStatus = async (courseId, enrolledId) => {
  try {
    const modulesRef = collection(db, "Course", courseId, "Modules");
    const modulesSnapshot = await getDocs(modulesRef);

    let totalSubmodules = 0;
    let totalReadSubmodules = 0;

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

        const submodules = await Promise.all(
          submodulesSnapshot.docs.map(async (subDoc) => {
            const submoduleData = { id: subDoc.id, ...subDoc.data() };

            // Check if the submodule is marked as read
            const submoduleReadRef = doc(
              db,
              "Enrolled",
              enrolledId,
              "CompletedSubmodule",
              subDoc.id
            );
            const submoduleReadSnap = await getDoc(submoduleReadRef);
            const hasRead = submoduleReadSnap.exists();

            if (hasRead) totalReadSubmodules++;
            totalSubmodules++;

            return { ...submoduleData, hasRead };
          })
        );
        return { ...moduleData, submodules }; // Attach submodules with read status
      })
    );
    return { modules, totalSubmodules, totalReadSubmodules };
  } catch (error) {
    console.error("Error fetching modules with read status:", error);
    throw error;
  }
};
