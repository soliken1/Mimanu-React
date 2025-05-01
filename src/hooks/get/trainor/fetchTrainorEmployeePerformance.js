import { db } from "../../../config/firebaseConfigs";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches and calculates employee performance for a specific trainor.
 * @param {string} trainorUID - The UID of the trainor.
 * @returns {Promise<{ totalScore: number, totalQuestions: number, averagePercentage: string, status: string }>}
 */
const fetchTrainorEmployeePerformance = async (trainorUID) => {
  try {
    // Step 1: Get all courses owned by the trainor
    const courseRef = collection(db, "Course");
    const courseQuery = query(courseRef, where("UID", "==", trainorUID));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty)
      return {
        totalScore: 0,
        totalQuestions: 0,
        averagePercentage: "0%",
        status: "Needs Assessment",
      };

    const courseIDs = courseSnapshot.docs.map((doc) => doc.id);

    let totalScore = 0;
    let totalQuestions = 0;

    // Step 2: Get all enrolled users
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);

    for (const enrolledDoc of enrolledSnapshot.docs) {
      const enrolledData = enrolledDoc.data();
      const courseID = enrolledData.CourseID;

      // ✅ Skip if not part of this trainor's courses
      if (!courseIDs.includes(courseID)) continue;

      const completedTaskRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "CompletedTask"
      );
      const completedTaskSnapshot = await getDocs(completedTaskRef);

      completedTaskSnapshot.forEach((taskDoc) => {
        const { Score, TotalQuestions } = taskDoc.data();
        if (Score !== undefined && TotalQuestions !== undefined) {
          totalScore += Score;
          totalQuestions += TotalQuestions;
        }
      });
    }

    const averagePercentage =
      totalQuestions > 0
        ? ((totalScore / totalQuestions) * 100).toFixed(2) + "%"
        : "0%";

    const status =
      totalQuestions > 0 && totalScore / totalQuestions >= 0.75
        ? "Passing"
        : "Needs Assessment";

    return { totalScore, totalQuestions, averagePercentage, status };
  } catch (error) {
    console.error(
      "Error fetching trainor-specific employee performance:",
      error
    );
    return {
      totalScore: 0,
      totalQuestions: 0,
      averagePercentage: "0%",
      status: "Needs Assessment",
    };
  }
};

export default fetchTrainorEmployeePerformance;
