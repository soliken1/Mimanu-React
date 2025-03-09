import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchCoursesByTrainor = async (trainorUID) => {
  try {
    const coursesCollection = collection(db, "Course"); // Reference to "Course" collection
    const q = query(coursesCollection, where("UID", "==", trainorUID)); // Query courses where TrainorUID matches
    const querySnapshot = await getDocs(q);

    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return courses; // Return the array of courses
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export default fetchCoursesByTrainor;
