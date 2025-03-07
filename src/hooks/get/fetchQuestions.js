import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust path

const fetchQuestions = async (courseId, taskId) => {
  try {
    const questionsRef = collection(
      db,
      "Course",
      courseId,
      "Tasks",
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
