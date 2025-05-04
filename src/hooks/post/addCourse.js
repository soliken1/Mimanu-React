import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfigs";

const addCourse = async (
  courseTitle,
  courseEnd,
  courseColor,
  courseDescription,
  courseTags
) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not authenticated");
    return { success: false, message: "User is not authenticated" };
  }

  try {
    const courseEndTimestamp = Timestamp.fromDate(new Date(courseEnd));

    await addDoc(collection(db, "Course"), {
      CourseTitle: courseTitle,
      CourseEnd: courseEndTimestamp,
      CourseStart: Timestamp.now(),
      CourseColor: courseColor,
      CourseDescription: courseDescription || "",
      CourseTags: courseTags || [],
      CreatedAt: Timestamp.now(),
      Status: "Enabled",
      UID: user.uid,
    });

    return { success: true, message: "Course added successfully" };
  } catch (error) {
    console.error("Error adding course:", error);
    return { success: false, message: "Failed to add course" };
  }
};

export default addCourse;
