import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchCourse = async (uid) => {
  try {
    const docRef = doc(db, "Course", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default fetchCourse;
