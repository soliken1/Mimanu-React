import { db } from "../../../config/firebaseConfigs";
import { collection, query, where, getDocs } from "firebase/firestore";
export default async function handler(req, res) {
  const { uid } = req.query;

  if (req.method === "GET") {
    if (!uid) {
      return res.status(400).json({ error: "Missing uid in request query" });
    }

    try {
      const formAnswersRef = collection(db, "Form-Answers");
      const q = query(
        formAnswersRef,
        where("formType", "==", "SelfForm"),
        where("answeredBy", "==", uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res
          .status(404)
          .json({ error: "No self-form answers found for this user." });
      }

      const formData = querySnapshot.docs[0].data();
      return res.status(200).json(formData);
    } catch (error) {
      console.error("Error fetching self-form data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
