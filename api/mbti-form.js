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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!uid) {
    return res.status(400).json({ error: "Missing uid in request query" });
  }

  try {
    const formAnswersRef = db.collection("Form-Answers");
    const q = formAnswersRef
      .where("formType", "==", "MBTIForm")
      .where("answeredBy", "==", uid);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "No mbti form answers found for this user." });
    }

    const formData = querySnapshot.docs[0].data();

    // --- MBTI logic below ---
    const traitMapping = [
      true, true, true, true,   // q1–q4 → E vs I
      true, true, true, true,   // q5–q8 → S vs N
      true, true, true, true,   // q9–q12 → T vs F
      true, true, true, true    // q13–q16 → J vs P
    ];

    const traitPairs = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"]
    ];

    const answers = [];
    for (let i = 1; i <= 16; i++) {
      const key = `q${i}`;
      const answerValue = formData[key]?.answer;
      if (!answerValue) {
        return res.status(400).json({ error: `Missing answer for question ${key}` });
      }
      answers.push(answerValue);
    }

    // Calculate MBTI Type
    let mbti = "";
    for (let i = 0; i < 4; i++) {
      let score = 0;
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j;
        const value = answers[index];
        const mapped = traitMapping[index] ? value : 6 - value;
        score += mapped;
      }
      mbti += score >= 12 ? traitPairs[i][0] : traitPairs[i][1];
    }

    return res.status(200).json({
      mbtiType: mbti,
      answers: formData,
    });

  } catch (error) {
    console.error("Error fetching mbti form data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
