import { db } from "../../config/firebaseConfigs";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Updates a specific course in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {object} updatedData - The new course data.
 */
const updateCourse = async (courseId, updatedData) => {
  try {
    const courseRef = doc(db, "Course", courseId);
    await updateDoc(courseRef, updatedData);
  } catch (error) {
    console.error("Error updating course:", error);
  }
};

export default updateCourse;
