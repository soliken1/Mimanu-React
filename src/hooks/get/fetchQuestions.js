import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust path

const fetchQuestions = async (courseId, taskId) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not authenticated");
    return [];
  }

  try {
    const questionsRef = collection(
      db,
      "Course",
      courseId,
      "Task",
      taskId,
      "Questions"
    );
    const querySnapshot = await getDocs(questionsRef);

    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export default fetchQuestions;
