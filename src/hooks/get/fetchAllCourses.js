import { db } from "../../config/firebaseConfigs";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const fetchAllCourses = async () => {
  try {
    const coursesCollection = collection(db, "Course");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Map through the courses and fetch user details
    const courses = await Promise.all(
      coursesSnapshot.docs.map(async (docSnapshot) => {
        const courseData = docSnapshot.data();
        const userRef = doc(db, "Users", courseData.UID);
        const userSnap = await getDoc(userRef);

        return {
          id: docSnapshot.id,
          ...courseData,
          user: userSnap.exists() ? userSnap.data() : null,
        };
      })
    );

    return courses;
  } catch (error) {
    console.error("Error fetching courses with user details:", error);
    return [];
  }
};

export default fetchAllCourses;
