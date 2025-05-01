import { db } from "../../config/firebaseConfigs";
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetches and calculates the overall employee performance.
 * Determines if the average score meets the 75% passing threshold.
 * @returns {Promise<{ totalScore: number, totalQuestions: number, averagePercentage: string, status: string }>}
 */
const fetchEmployeePerformance = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);
    const enrolledDocs = enrolledSnapshot.docs;

    let totalScore = 0;
    let totalQuestions = 0;

    //  Loop through each enrolled employee
    for (const enrolledDoc of enrolledDocs) {
      const completedTaskRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "CompletedTask"
      );

      //  Fetch all completed tasks
      const completedTaskSnapshot = await getDocs(completedTaskRef);

      //  Sum scores and total possible questions
      completedTaskSnapshot.docs.forEach((taskDoc) => {
        const { Score, TotalQuestions } = taskDoc.data();
        if (Score !== undefined && TotalQuestions !== undefined) {
          totalScore += Score;
          totalQuestions += TotalQuestions;
        }
      });
    }

    //  Calculate the average percentage
    const averagePercentage =
      totalQuestions > 0
        ? ((totalScore / totalQuestions) * 100).toFixed(2) + "%"
        : "0%";

    // Determine pass/fail status
    const status =
      totalQuestions > 0 && totalScore / totalQuestions >= 0.75
        ? "Passing"
        : "Needs Assessment";

    return { totalScore, totalQuestions, averagePercentage, status };
  } catch (error) {
    console.error("Error fetching employee performance:", error);
    return {
      totalScore: 0,
      totalQuestions: 0,
      averagePercentage: "0%",
      status: "Needs Assessment",
    };
  }
};

export default fetchEmployeePerformance;
