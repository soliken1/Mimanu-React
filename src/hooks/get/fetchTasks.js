import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfigs"; // Adjust based on your project structure

const fetchTasks = async (courseId, enrollId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!courseId || !enrollId) {
      console.error("No courseId or enrollId provided for fetching tasks.");
      return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
    }

    // Reference to the "Tasks" subcollection inside the specific Course document
    const tasksRef = collection(db, "Course", courseId, "Task");
    const querySnapshot = await getDocs(tasksRef);

    let tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Fetch the "CompletedTask" subcollection under "Enrolled"
    const completedTasksRef = collection(
      db,
      "Enrolled",
      enrollId,
      "CompletedTask"
    );
    const completedQuerySnapshot = await getDocs(completedTasksRef);

    // Store completed tasks along with their details
    let completedTasks = {};
    completedQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.Answered) {
        completedTasks[doc.id] = { ...data }; // Store full details
      }
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

      // Check if the task has been answered & attach details
      const completedData = completedTasks[task.id] || null;
      const isAnswered = !!completedData;

      const taskWithStatus = { ...task, isAnswered, completedData }; // Append completed task details

      if (endDate && endDate < now) {
        pastTasks.push(taskWithStatus);
      } else if (startDate && startDate <= now && endDate && endDate >= now) {
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

    // Reference to the "Tasks" subcollection inside the specific Course document
    const tasksRef = collection(db, "Course", courseId, "Task");
    const querySnapshot = await getDocs(tasksRef);
    let pastTasks = [];
    let availableTasks = [];
    let upcomingTasks = [];

    const now = new Date();

    querySnapshot.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };

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
    console.error("Error fetching all tasks for admin:", error);
    return { pastTasks: [], availableTasks: [], upcomingTasks: [] };
  }
};

export { fetchTasks, fetchAllTasks };
export default fetchTasks;
