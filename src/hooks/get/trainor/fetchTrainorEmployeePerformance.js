import { db } from "../../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

/**
 * Fetches and calculates employee performance for a specific trainor.
 * Includes per-course breakdown.
 * @param {string} trainorUID - The UID of the trainor.
 * @returns {Promise<{ totalScore: number, totalQuestions: number, averagePercentage: string, status: string, specificCourses: object }>}
 */
const fetchTrainorEmployeePerformance = async (trainorUID) => {
  try {
    // Step 1: Get all courses owned by the trainor
    const courseRef = collection(db, "Course");
    const courseQuery = query(courseRef, where("UID", "==", trainorUID));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
      return {
        totalScore: 0,
        totalQuestions: 0,
        averagePercentage: "0%",
        status: "Needs Assessment",
        specificCourses: {},
      };
    }

    const courseIDs = courseSnapshot.docs.map((doc) => doc.id);

    let totalScore = 0;
    let totalQuestions = 0;
    const specificCourses = {};
    const courseTitleCache = {};

    // Step 2: Get all enrolled users
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);

    for (const enrolledDoc of enrolledSnapshot.docs) {
      const enrolledData = enrolledDoc.data();
      const courseID = enrolledData.CourseID;

      // Skip if not related to this trainor
      if (!courseIDs.includes(courseID)) continue;

      // Get course title and color from cache or fetch from Firestore
      let courseTitle = courseTitleCache[courseID]?.title;
      let courseColor = courseTitleCache[courseID]?.color;

      if (!courseTitle) {
        const courseDoc = await getDoc(doc(db, "Course", courseID));
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          courseTitle = courseData.CourseTitle || "Unknown Course";
          courseColor = courseData.CourseColor || "#cccccc";
          courseTitleCache[courseID] = {
            title: courseTitle,
            color: courseColor,
          };
        } else {
          courseTitle = "Unknown Course";
          courseColor = "#cccccc";
          courseTitleCache[courseID] = {
            title: courseTitle,
            color: courseColor,
          };
        }
      }

      // Get completed tasks
      const completedTaskRef = collection(
        db,
        "Enrolled",
        enrolledDoc.id,
        "CompletedTask"
      );
      const completedTaskSnapshot = await getDocs(completedTaskRef);

      for (const taskDoc of completedTaskSnapshot.docs) {
        const { Score, TotalQuestions } = taskDoc.data();

        if (Score !== undefined && TotalQuestions !== undefined) {
          totalScore += Score;
          totalQuestions += TotalQuestions;

          if (!specificCourses[courseTitle]) {
            specificCourses[courseTitle] = {
              totalScore: 0,
              totalQuestions: 0,
              averagePercentage: "0%",
              color: courseColor,
            };
          }

          specificCourses[courseTitle].totalScore += Score;
          specificCourses[courseTitle].totalQuestions += TotalQuestions;
        }
      }
    }

    // Calculate per-course average
    for (const course in specificCourses) {
      const c = specificCourses[course];
      c.averagePercentage =
        c.totalQuestions > 0
          ? ((c.totalScore / c.totalQuestions) * 100).toFixed(2) + "%"
          : "0%";
    }

    const averagePercentage =
      totalQuestions > 0
        ? ((totalScore / totalQuestions) * 100).toFixed(2) + "%"
        : "0%";

    const status =
      totalQuestions > 0 && totalScore / totalQuestions >= 0.75
        ? "Passing"
        : "Needs Assessment";

    return {
      totalScore,
      totalQuestions,
      averagePercentage,
      status,
      specificCourses,
    };
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
      specificCourses: {},
    };
  }
};

export default fetchTrainorEmployeePerformance;
