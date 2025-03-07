import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust path

const addQuestion = async (courseId, taskId, questionData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const questionRef = doc(
      collection(db, "Course", courseId, "Task", taskId, "Questions")
    );
    await setDoc(questionRef, questionData);

    return questionRef.id; // Return generated question ID
  } catch (error) {
    console.error("Error adding question:", error);
    return null;
  }
};

export default addQuestion;
