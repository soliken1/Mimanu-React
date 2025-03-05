import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchEmployees = async () => {
  try {
    const employeesQuery = query(
      collection(db, "Users"),
      where("UserRole", "==", "Employee")
    );
    const querySnapshot = await getDocs(employeesQuery);

    const employees = [];
    querySnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
    });

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export default fetchEmployees;
