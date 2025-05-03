import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const { uid } = req.query;

  if (req.method === "GET") {
    if (!uid) {
      return res.status(400).json({ error: "Missing uid in request query" });
    }

    try {
      const formAnswersRef = db.collection("Form-Answers");
      const q = formAnswersRef
        .where("formType", "==", "PeerForm")
        .where("answeredBy", "==", uid);

      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        return res
          .status(404)
          .json({ error: "No superior form answers found for this user." });
      }

      const formData = querySnapshot.docs[0].data();
      return res.status(200).json(formData);
    } catch (error) {
      console.error("Error fetching superior form data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
