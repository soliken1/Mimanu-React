import { db, auth } from "../../config/firebaseConfigs";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Function to add a task to a course's subcollection in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {Object} taskData - The task data including StartDate and EndDate as strings.
 */
const addTask = async (courseId, taskData) => {
  try {
    // Ensure the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Convert StartDate and EndDate to Firestore Timestamp
    const formattedTaskData = {
      ...taskData,
      StartDate: Timestamp.fromDate(new Date(taskData.StartDate)),
      EndDate: Timestamp.fromDate(new Date(taskData.EndDate)),
    };

    // Reference the "Task" subcollection inside the specific Course document
    const taskRef = collection(db, "Course", courseId, "Task");

    // Add a new Task document to the subcollection
    const docRef = await addDoc(taskRef, formattedTaskData);

    return docRef.id;
  } catch (error) {
    console.error("Error adding Task:", error);
    return null;
  }
};

export default addTask;
