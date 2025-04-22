import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchUserRole = async (uid) => {
  try {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().UserRole || null;
    } else {
      console.warn("No user found for UID:", UID);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

export default fetchUserRole;
