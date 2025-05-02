import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const fetchEmployeePerformance = async () => {
  try {
    const enrolledRef = collection(db, "Enrolled");
    const enrolledSnapshot = await getDocs(enrolledRef);
    const enrolledDocs = enrolledSnapshot.docs;

    let totalScore = 0;
    let totalQuestions = 0;

    const specificCourses = {};
    const courseTitleCache = {}; // Cache to avoid duplicate fetches

    for (const enrolledDoc of enrolledDocs) {
      const enrolledData = enrolledDoc.data();
      const courseId = enrolledData.CourseID;

      if (!courseId) continue; // Skip if CourseID is missing

      // Get course title from cache or fetch from "Course" collection
      let courseTitle = courseTitleCache[courseId];
      if (!courseTitle) {
        const courseDoc = await getDoc(doc(db, "Course", courseId));
        courseTitle = courseDoc.exists()
          ? courseDoc.data().CourseTitle
          : "Unknown Course";
        courseTitleCache[courseId] = courseTitle;
      }

      // Get completed tasks for this enrolled document
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

          // Initialize course if not already present
          if (!specificCourses[courseTitle]) {
            specificCourses[courseTitle] = {
              totalScore: 0,
              totalQuestions: 0,
              averagePercentage: "0%",
            };
          }

          specificCourses[courseTitle].totalScore += Score;
          specificCourses[courseTitle].totalQuestions += TotalQuestions;
        }
      }
    }

    // Calculate averagePercentage per course
    for (const course in specificCourses) {
      const c = specificCourses[course];
      c.averagePercentage =
        c.totalQuestions > 0
          ? ((c.totalScore / c.totalQuestions) * 100).toFixed(2) + "%"
          : "0%";
    }

    // Calculate overall average and status
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
    console.error("Error fetching employee performance:", error);
    return {
      totalScore: 0,
      totalQuestions: 0,
      averagePercentage: "0%",
      status: "Needs Assessment",
      specificCourses: {},
    };
  }
};

export default fetchEmployeePerformance;
