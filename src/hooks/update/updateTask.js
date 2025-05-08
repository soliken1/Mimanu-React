import { db } from "../../config/firebaseConfigs";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Updates a specific task in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} taskId - The ID of the task.
 * @param {object} updatedData - The new submodule data.
 */
const updateTask = async (courseId, taskId, updatedData) => {
  try {
    const taskRef = doc(db, "Course", courseId, "Task", taskId);
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export default updateTask;
