import { db, auth } from "../../../config/firebaseConfigs";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetches all available tasks across all courses the user is enrolled in.
 * @returns {Promise<{ pastTasks: Array, availableTasks: Array, upcomingTasks: Array }>}
 */
const fetchAllAvailableTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // ✅ Step 1: Fetch all courses the user is enrolled in
    const enrolledRef = collection(db, "Enrolled");
    const enrolledQuery = query(enrolledRef, where("UserID", "==", user.uid));
    const enrolledSnapshot = await getDocs(enrolledQuery);
    if (enrolledSnapshot.empty) {
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    const enrolledCourses = enrolledSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data.CourseID) return null; // 🔍 Prevent undefined values
        return { enrollId: doc.id, CourseID: data.CourseID };
      })
      .filter(Boolean); // ✅ Remove null values

    let pastTasks = [];
    let availableTasks = [];
    let upcomingTasks = [];

    const now = new Date();

    // ✅ Step 2: Loop through enrolled courses and fetch tasks
    for (const { CourseID, enrollId } of enrolledCourses) {
      if (!CourseID || !enrollId) continue; // 🔍 Skip if undefined
      const tasksRef = collection(db, "Course", CourseID, "Task");
      const tasksSnapshot = await getDocs(tasksRef);

      if (tasksSnapshot.empty) continue;

      let tasks = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Step 3: Fetch completed tasks from "CompletedTask" subcollection
      const completedTasksRef = collection(
        db,
        "Enrolled",
        enrollId,
        "CompletedTask"
      );
      const completedSnapshot = await getDocs(completedTasksRef);

      let completedTasks = {};
      completedSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.Answered) {
          completedTasks[doc.id] = { ...data };
        }
      });

      // ✅ Step 4: Categorize tasks based on completion status and date
      tasks.forEach((task) => {
        const startDate = task.StartDate?.seconds
          ? new Date(task.StartDate.seconds * 1000)
          : null;
        const endDate = task.EndDate?.seconds
          ? new Date(task.EndDate.seconds * 1000)
          : null;

        const isAnswered = completedTasks[task.id] !== undefined;
        const taskWithStatus = { ...task, isAnswered, CourseID, enrollId };

        if (!isAnswered) {
          if (endDate && endDate < now) {
            pastTasks.push(taskWithStatus);
          } else if (
            startDate &&
            startDate <= now &&
            endDate &&
            endDate >= now
          ) {
            availableTasks.push(taskWithStatus);
          } else {
            upcomingTasks.push(taskWithStatus);
          }
        }
      });
    }
    return { pastTasks, availableTasks, upcomingTasks };
  } catch (error) {
    console.error("Error fetching all available tasks:", error);
    return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
  }
};

export default fetchAllAvailableTasks;
