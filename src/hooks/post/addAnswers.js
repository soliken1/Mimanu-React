import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust the path as needed

const submitAnswers = async (enrolledId, answers, questionsData) => {
  try {
    // Ensure the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Step 1: Compare answers and calculate score
    let Score = 0;
    const TotalQuestions = questionsData.length;
    console.log(questionsData);
    const userAnswers = questionsData.map((question) => {
      const UserAnswer = answers[question.id] || "";
      const CorrectAnswer = question.Answer; // Assuming "Answer" field contains the correct answer

      // Check if the user's answer matches the correct one
      const IsCorrect =
        UserAnswer.trim().toLowerCase() === CorrectAnswer.trim().toLowerCase();
      if (IsCorrect) Score++;

      return {
        questionId: question.id,
        UserAnswer,
        CorrectAnswer,
        IsCorrect,
      };
    });

    // Step 2: Save the score and answers in Firebase under "CompletedTask"
    const completedTaskRef = collection(
      db,
      "Enrolled",
      enrolledId,
      "CompletedTask"
    );
    const newTaskDoc = await addDoc(completedTaskRef, {
      Score,
      TotalQuestions,
      Answered: true,
      SubmittedAt: new Date(),
    });

    // Step 3: Save the detailed answers inside "Answers" subcollection
    const answersRef = collection(
      db,
      "Enrolled",
      enrolledId,
      "CompletedTask",
      newTaskDoc.id,
      "Answers"
    );

    await Promise.all(
      userAnswers.map(async (answer) => {
        await addDoc(answersRef, answer);
      })
    );

    console.log("Answers submitted successfully.");
    return { success: true, Score, TotalQuestions };
  } catch (error) {
    console.error("Error submitting answers:", error);
    return { success: false, error };
  }
};

export default submitAnswers;
