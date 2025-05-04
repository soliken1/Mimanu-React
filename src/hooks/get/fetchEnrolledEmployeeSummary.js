import { db } from "../../config/firebaseConfigs";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { fetchModulesWithReadStatus } from "./fetchModulesWithReadStatus";
import fetchTasks from "./fetchTasks";

const fetchEnrolledUsersSummary = async (courseID) => {
  try {
    // Fetch enrolled employees for the given course
    const enrolledRef = collection(db, "Enrolled");
    const q = query(enrolledRef, where("CourseID", "==", courseID));
    const querySnapshot = await getDocs(q);

    // Extract enrolled employees
    const enrolledUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Process each enrolled user to fetch progress details
    const userSummaries = await Promise.all(
      enrolledUsers.map(async (enrolled) => {
        try {
          // Fetch user details
          const userRef = doc(db, "Users", enrolled.UserID);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            console.warn(`User not found for UserID: ${enrolled.UserID}`);
            return null; // Skip if user doesn't exist
          }

          const userData = userSnap.data();

          // Fetch Modules & Submodules Progress
          const {
            totalModules,
            totalCompletedModules,
            totalSubmodules,
            totalReadSubmodules,
          } = await fetchModulesWithReadStatus(courseID, enrolled.id);

          // Fetch Task Progress
          const { availableTasks, pastTasks } = await fetchTasks(
            courseID,
            enrolled.id
          );

          const totalTasks = availableTasks.length + pastTasks.length;
          const completedTasks =
            availableTasks.filter((task) => task.isAnswered).length +
            pastTasks.filter((task) => task.isAnswered).length;

          // Calculate Total Score from Completed Tasks
          let totalScore = 0;
          let totalPossibleScore = 0;

          pastTasks.forEach((task) => {
            if (task.isAnswered && task.completedData) {
              totalScore += task.completedData.Score || 0;
              totalPossibleScore += task.completedData.TotalQuestions || 0;
            }
          });

          availableTasks.forEach((task) => {
            if (task.isAnswered && task.completedData) {
              totalScore += task.completedData.Score || 0;
              totalPossibleScore += task.completedData.TotalQuestions || 0;
            }
          });

          // Compute Score Percentage
          const scorePercentage =
            totalPossibleScore > 0
              ? ((totalScore / totalPossibleScore) * 100).toFixed(2)
              : "0";

          // Assign Grade
          let grade = scorePercentage >= 75 ? "Passing" : "Failing";
          const totalCourseProgress =
            totalModules + totalSubmodules + totalTasks;
          const totalEmployeeProgress =
            totalCompletedModules + totalReadSubmodules + completedTasks;
          let status =
            totalCourseProgress === totalEmployeeProgress
              ? "Completed"
              : "On-Going";

          if (totalCourseProgress === totalEmployeeProgress) {
            grade = scorePercentage >= 75 ? "Passed" : "Failed";

            const enrolledDocRef = doc(db, "Enrolled", enrolled.id);
            await updateDoc(enrolledDocRef, {
              Status: "Completed",
            });
          }

          let score = `${totalScore}/${totalPossibleScore} (${scorePercentage}%)`;

          if (totalScore === 0 && totalPossibleScore === 0) {
            grade = "Pending";
            score = "No Scores";
          }

          return {
            id: enrolled.id,
            UserID: userData.UID,
            UserImg: userData.UserImg || null,
            FirstName: userData.FirstName || "Unknown",
            LastName: userData.LastName || "Unknown",
            TotalEmployeeProgress: totalEmployeeProgress,
            TotalCourseProgress: totalCourseProgress,
            Score: score,
            Grade: grade,
            DateEnrolled: enrolled.DateEnrolled,
            Status: status,
          };
        } catch (error) {
          console.error(`Error processing user ${enrolled.UserID}:`, error);
          return null; // Skip this user on failure
        }
      })
    );

    // Filter out any null values
    return userSummaries.filter((summary) => summary !== null);
  } catch (error) {
    console.error("Error fetching enrolled users summary:", error);
    return [];
  }
};

export default fetchEnrolledUsersSummary;
