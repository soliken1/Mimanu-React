import { db, auth } from "../../config/firebaseConfigs"; // Import Firebase auth
import { collection, addDoc } from "firebase/firestore";

/**
 * Function to add a module to a course's subcollection in Firestore.
 * @param {string} courseId - The ID of the course to add the module to.
 * @param {object} moduleData - The data of the module being added.
 */
const addModuleToCourse = async (courseId, moduleData) => {
  try {
    // Get the currently authenticated user
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Reference the "Modules" subcollection inside the course document
    const modulesRef = collection(db, "Course", courseId, "Modules");

    // Add additional metadata
    const moduleWithMeta = {
      ...moduleData,
      createdAt: new Date(),
    };

    // Add a new module document to the subcollection
    const docRef = await addDoc(modulesRef, moduleWithMeta);

    console.log("Module added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding module:", error);
    throw error;
  }
};

export default addModuleToCourse;
