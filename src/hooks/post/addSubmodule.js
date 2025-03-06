import { db, auth } from "../../config/firebaseConfigs";
import { collection, addDoc } from "firebase/firestore";

/**
 * Function to add a submodule to a module's subcollection in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} moduleId - The ID of the module to add the submodule to.
 * @param {object} submoduleData - The data of the submodule being added.
 */
const addSubmoduleToModule = async (courseId, moduleId, submoduleData) => {
  try {
    // Reference the "Submodules" subcollection inside the specific Module document
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const submodulesRef = collection(
      db,
      "Course",
      courseId,
      "Modules",
      moduleId,
      "Submodules"
    );

    // Add a new submodule document to the subcollection
    const docRef = await addDoc(submodulesRef, submoduleData);

    console.log("Submodule added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding submodule:", error);
    return null;
  }
};

export default addSubmoduleToModule;
