import { db, auth } from "../../../config/firebaseConfigs";
import { collection, getDocs, query, where } from "firebase/firestore";

// ✅ Helper to combine Firestore date and 24h time string into a JS Date object
const combineDateAndTime = (date, timeStr) => {
  if (!date || !timeStr) return null;
  const dateObj = new Date(date.seconds * 1000);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    hours,
    minutes
  );
};

const fetchAllAvailableTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const enrolledRef = collection(db, "Enrolled");
    const enrolledQuery = query(enrolledRef, where("UserID", "==", user.uid));
    const enrolledSnapshot = await getDocs(enrolledQuery);
    if (enrolledSnapshot.empty) {
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    const enrolledCourses = enrolledSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data.CourseID) return null;
        return { enrollId: doc.id, CourseID: data.CourseID };
      })
      .filter(Boolean);

    let pastTasks = [];
    let availableTasks = [];
    let upcomingTasks = [];

    const now = new Date();

    for (const { CourseID, enrollId } of enrolledCourses) {
      if (!CourseID || !enrollId) continue;

      const tasksRef = collection(db, "Course", CourseID, "Task");
      const tasksSnapshot = await getDocs(tasksRef);
      if (tasksSnapshot.empty) continue;

      const tasks = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const completedTasksRef = collection(
        db,
        "Enrolled",
        enrollId,
        "CompletedTask"
      );
      const completedSnapshot = await getDocs(completedTasksRef);
      const completedTasks = {};
      completedSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.Answered) {
          completedTasks[doc.id] = { ...data };
        }
      });

      tasks.forEach((task) => {
        const startDateTime = combineDateAndTime(
          task.StartDate,
          task.StartTime
        );
        const endDateTime = combineDateAndTime(task.EndDate, task.EndTime);
        const isAnswered = completedTasks[task.id] !== undefined;
        const taskWithStatus = { ...task, isAnswered, CourseID, enrollId };

        if (!isAnswered) {
          if (endDateTime && endDateTime < now) {
            pastTasks.push(taskWithStatus);
          } else if (
            startDateTime &&
            endDateTime &&
            startDateTime <= now &&
            endDateTime >= now
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
