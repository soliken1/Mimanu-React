import { db } from "../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

/**
 * Fetches completed progress and merges it with actual course data.
 * @param {string} courseId - The ID of the course.
 * @param {string} enrolledId - The ID of the enrolled document for the user.
 * @returns {Promise<Array>} - A single array containing all progress sorted by date.
 */
export const fetchCompletedProgress = async (courseId, enrolledId) => {
  try {
    // Helper function to fetch completed progress
    const fetchCollection = async (subcollectionName) => {
      const ref = collection(db, "Enrolled", enrolledId, subcollectionName);
      const q = query(ref, orderBy("CompletedAt", "asc")); // Ensure Firestore index exists!
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: subcollectionName,
        ...doc.data(),
      }));
    };

    // Fetch all completed progress
    const [completedModules, completedSubmodules, completedTasks] =
      await Promise.all([
        fetchCollection("CompletedModule"),
        fetchCollection("CompletedSubmodule"),
        fetchCollection("CompletedTask"),
      ]);

    // Helper function to fetch course data
    const fetchCourseData = async (collectionName, parentId = null) => {
      const ref = parentId
        ? collection(
            db,
            "Course",
            courseId,
            "Modules",
            parentId,
            collectionName
          ) // For Submodules
        : collection(db, "Course", courseId, collectionName); // For Modules and Tasks
      const snapshot = await getDocs(ref);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: collectionName,
        ...doc.data(),
      }));
    };

    // Fetch Modules
    const modules = await fetchCourseData("Modules");

    // Fetch Submodules for each module
    const submodules = (
      await Promise.all(
        modules.map((module) => fetchCourseData("Submodules", module.id))
      )
    ).flat(); // Flatten since each module has multiple submodules

    // Fetch Tasks
    const tasks = await fetchCourseData("Task");

    // Merge completed data with course data
    const mergeData = (completedData, originalData) => {
      return completedData.map((completedItem) => {
        const originalItem = originalData.find(
          (item) => item.id === completedItem.id
        );
        return {
          ...originalItem,
          ...completedItem,
        };
      });
    };

    const mergedModules = mergeData(completedModules, modules);
    const mergedSubmodules = mergeData(completedSubmodules, submodules);
    const mergedTasks = mergeData(completedTasks, tasks);

    // Merge all and sort by CompletedAt
    const allProgress = [
      ...mergedModules,
      ...mergedSubmodules,
      ...mergedTasks,
    ].sort((a, b) => a.CompletedAt - b.CompletedAt);

    return allProgress;
  } catch (error) {
    console.error("Error fetching aggregated progress:", error);
    throw error;
  }
};
