import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust based on your project structure

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

const fetchTasks = async (courseId, enrollId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    if (!courseId || !enrollId) {
      console.error("No courseId or enrollId provided.");
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    const tasksRef = collection(db, "Course", courseId, "Task");
    const querySnapshot = await getDocs(tasksRef);

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const completedTasksRef = collection(
      db,
      "Enrolled",
      enrollId,
      "CompletedTask"
    );
    const completedQuerySnapshot = await getDocs(completedTasksRef);

    const completedTasks = {};
    completedQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.Answered) {
        completedTasks[doc.id] = { ...data };
      }
    });

    const now = new Date();
    const pastTasks = [];
    const availableTasks = [];
    const upcomingTasks = [];

    tasks.forEach((task) => {
      const startDateTime = combineDateAndTime(task.StartDate, task.StartTime);
      const endDateTime = combineDateAndTime(task.EndDate, task.EndTime);
      const isAnswered = !!completedTasks[task.id];
      const completedData = completedTasks[task.id] || null;
      const taskWithStatus = { ...task, isAnswered, completedData };

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
    });

    return { pastTasks, availableTasks, upcomingTasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
  }
};

// ✅ New function to fetch all tasks (for Admin)
const fetchAllTasks = async (courseId) => {
  try {
    if (!courseId) {
      console.error("No courseId provided for fetching all tasks.");
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    const tasksRef = collection(db, "Course", courseId, "Task");
    const querySnapshot = await getDocs(tasksRef);

    let pastTasks = [];
    let availableTasks = [];
    let upcomingTasks = [];

    const now = new Date();

    querySnapshot.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };

      const startDateTime = combineDateAndTime(task.StartDate, task.StartTime);
      const endDateTime = combineDateAndTime(task.EndDate, task.EndTime);

      if (endDateTime && endDateTime < now) {
        pastTasks.push(task);
      } else if (
        startDateTime &&
        endDateTime &&
        startDateTime <= now &&
        endDateTime >= now
      ) {
        availableTasks.push(task);
      } else {
        upcomingTasks.push(task);
      }
    });

    return { pastTasks, availableTasks, upcomingTasks };
  } catch (error) {
    console.error("Error fetching all tasks for admin:", error);
    return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
  }
};

export { fetchTasks, fetchAllTasks };
export default fetchTasks;
