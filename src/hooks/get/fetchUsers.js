import { collection, getDocs } from "firebase/firestore";
import { auth } from "../../config/firebaseConfigs";
import { db } from "../../config/firebaseConfigs";

const fetchUsers = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not authenticated");
    return [];
  }

  try {
    const usersCollection = collection(db, "Users");
    const usersSnapshot = await getDocs(usersCollection);

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default fetchUsers;
