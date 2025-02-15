import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchUser = async (uid) => {
  try {
    const docRef = doc(db, "Users", uid);
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

export default fetchUser;
