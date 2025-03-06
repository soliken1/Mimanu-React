import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust the import path based on your project structure

const fetchTasks = async (courseId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!courseId) {
      console.error("No courseId provided for fetching tasks.");
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    // Reference to the "Tasks" subcollection inside the specific Course document
    const tasksRef = collection(db, "Course", courseId, "Task");
    const querySnapshot = await getDocs(tasksRef);

    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Get current date
    const now = new Date();

    // Categorize tasks
    const pastTasks = [];
    const availableTasks = [];
    const upcomingTasks = [];

    tasks.forEach((task) => {
      const startDate = task.StartDate?.seconds
        ? new Date(task.StartDate.seconds * 1000)
        : null;
      const endDate = task.EndDate?.seconds
        ? new Date(task.EndDate.seconds * 1000)
        : null;

      if (endDate && endDate < now) {
        pastTasks.push(task);
      } else if (startDate && startDate <= now && endDate && endDate >= now) {
        availableTasks.push(task);
      } else {
        upcomingTasks.push(task);
      }
    });

    return { pastTasks, availableTasks, upcomingTasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
  }
};

export default fetchTasks;
