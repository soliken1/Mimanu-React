import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfigs"; // adjust path if needed

const checkEmployeeAnsweredForm = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const formAnswersRef = collection(db, "Form-Answers");
    const q = query(
      formAnswersRef,
      where("userId", "==", user.uid),
      where("formType", "==", "Survey")
    );

    const snapshot = await getDocs(q);

    // Return true if at least one document is found
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking form answer status:", error);
    return false;
  }
};

export default checkEmployeeAnsweredForm;
