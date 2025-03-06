import { db, auth } from "../../config/firebaseConfigs";
import { collection, addDoc } from "firebase/firestore";

/**
 * Function to add a task to a course's subcollection in Firestore.
 * @param {string} courseId - The ID of the course.
 */
const addTask = async (courseId, taskData) => {
  try {
    // Reference the "Task" subcollection inside the specific Course document
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const taskRef = collection(db, "Course", courseId, "Task");

    // Add a new Task document to the subcollection
    const docRef = await addDoc(taskRef, taskData);

    return docRef.id;
  } catch (error) {
    console.error("Error adding Task:", error);
    return null;
  }
};

export default addTask;
