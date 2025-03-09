import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs"; // Adjust the path based on your setup

const fetchNotEnrolledEmployees = async (courseId) => {
  try {
    // Step 1: Fetch users with UserRole = "Employee"
    const usersQuery = query(
      collection(db, "Users"),
      where("UserRole", "==", "Employee")
    );
    const usersSnapshot = await getDocs(usersQuery);
    const allEmployees = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Step 2: Fetch enrolled users for the given courseId
    const enrolledQuery = query(
      collection(db, "Enrolled"),
      where("CourseID", "==", courseId)
    );
    const enrolledSnapshot = await getDocs(enrolledQuery);
    const enrolledUserIds = new Set(
      enrolledSnapshot.docs.map((doc) => doc.data().UserID)
    );

    // Step 3: Filter out employees who are already enrolled
    const notEnrolledEmployees = allEmployees.filter(
      (user) => !enrolledUserIds.has(user.id)
    );

    return notEnrolledEmployees;
  } catch (error) {
    console.error("Error fetching not enrolled employees:", error);
    return [];
  }
};

export default fetchNotEnrolledEmployees;
