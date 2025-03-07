import { db } from "../../config/firebaseConfigs"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";

/**
 * Fetches a specific taslk from Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<Object|null>} - The submodule data or null if not found.
 */
const fetchTask = async (courseId, taskId) => {
  try {
    // Reference to the specific task document
    const taskRef = doc(db, "Course", courseId, "Task", taskId);

    // Fetch the document
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      return { id: taskSnap.id, ...taskSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export default fetchTask;
