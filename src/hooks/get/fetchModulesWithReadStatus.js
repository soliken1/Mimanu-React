import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

/**
 * Fetches all modules and their submodules for a specific course,
 * while also checking if the user has read each submodule.
 * @param {string} courseId - The ID of the course.
 * @param {string} enrolledId - The enrolled document ID of the user.
 * @returns {Promise<Object>} - An object containing modules, read progress, and completion stats.
 */
export const fetchModulesWithReadStatus = async (courseId, enrolledId) => {
  try {
    const modulesRef = collection(db, "Course", courseId, "Modules");
    const modulesSnapshot = await getDocs(modulesRef);

    let totalSubmodules = 0;
    let totalReadSubmodules = 0;
    let totalModules = modulesSnapshot.docs.length;
    let totalCompletedModules = 0;

    // Fetch completed modules for the user
    const completedModulesRef = collection(
      db,
      "Enrolled",
      enrolledId,
      "CompletedModule"
    );
    const completedModulesSnapshot = await getDocs(completedModulesRef);
    const completedModuleIds = new Set(
      completedModulesSnapshot.docs.map((doc) => doc.id)
    );

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

        let submoduleReadCount = 0;
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

            if (hasRead) {
              totalReadSubmodules++;
              submoduleReadCount++;
            }
            totalSubmodules++;

            return { ...submoduleData, hasRead };
          })
        );

        // Check if the module is completed
        const isModuleCompleted = submoduleReadCount === submodules.length;
        if (isModuleCompleted || completedModuleIds.has(moduleDoc.id)) {
          totalCompletedModules++;
        }

        return { ...moduleData, submodules, isModuleCompleted };
      })
    );

    return {
      modules,
      totalSubmodules,
      totalReadSubmodules,
      totalModules,
      totalCompletedModules,
    };
  } catch (error) {
    console.error("Error fetching modules with read status:", error);
    throw error;
  }
};
