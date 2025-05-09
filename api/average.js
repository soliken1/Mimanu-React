export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uid = req.query.uid;
  if (!uid) {
    return res.status(400).json({ error: "Missing uid parameter" });
  }

  const urls = [
    `https://mimanu-react.vercel.app/api/superior-form?uid=${uid}`,
    `https://mimanu-react.vercel.app/api/peer-form?uid=${uid}`,
    `https://mimanu-react.vercel.app/api/self-form?uid=${uid}`,
  ];

  // Course suggestions
  const courseSuggestions = {
    "Leadership": [
      "Fundamentals of Leadership",
      "Introduction to Transformational Leadership",
    ],
    "Critical Thinking": [
      "Identifying Assumptions & Evaluating Evidence",
      "Introduction to Problem-Solving Techniques",
      "Mind Mapping & Metacognition Awareness",
      "Advanced Problem-Solving & Decision-Making",
    ],
    "Time Management": [
      "Prioritization & Managing Distractions",
      "Introduction to Goal Setting",
    ],
    "Communication": [
      "Active Listening",
      "Effective Reporting/Presenting",
      "Public Speaking",
      "Persuasive Communication & Negotiation",
    ],
    "Teamwork": [
      "Fundamentals of Teamwork",
      "Collaboration & Negotiation",
    ],
  };

  try {
    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const data = await Promise.all(responses.map((r) => r.json()));

    const batches = {
      "Critical Thinking": [1, 10],
      "Time Management": [11, 20],
      "Teamwork": [21, 30],
      "Leadership": [31, 40],
      "Communication": [41, 50],
    };

    const batchTotals = {};
    const batchCounts = {};
    const questionTotals = {};
    const questionCounts = {};

    data.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key.startsWith("q")) {
          const value = entry[key];
          const answer = value && typeof value === "object" ? value.answer : value;
          const questionNumber = parseInt(key.slice(1), 10);

          if (!isNaN(questionNumber) && typeof answer === "number") {
            questionTotals[key] = (questionTotals[key] || 0) + answer;
            questionCounts[key] = (questionCounts[key] || 0) + 1;

            for (const [batchName, [start, end]] of Object.entries(batches)) {
              if (questionNumber >= start && questionNumber <= end) {
                batchTotals[batchName] = (batchTotals[batchName] || 0) + answer;
                batchCounts[batchName] = (batchCounts[batchName] || 0) + 1;
                break;
              }
            }
          }
        }
      });
    });

    const batchAverages = {};
    const predictions = {};
    const LOW_THRESHOLD = 3;

    for (const batch in batches) {
      const total = batchTotals[batch] || 0;
      const count = batchCounts[batch] || 0;
      const average = count > 0 ? total / count : null;
      batchAverages[batch] = average;
    
      const options = courseSuggestions[batch];
      if (average !== null && options && options.length > 0) {
        if (average < LOW_THRESHOLD) {
          const randomIndex = Math.floor(Math.random() * options.length);
          predictions[batch] = options[randomIndex];
        } else {
          predictions[batch] = "Keep up the good work! Just maintain and continue improving.";
        }
      }
    }
    

    const questionAverages = {};
    Object.keys(questionTotals).forEach((key) => {
      questionAverages[key] = questionTotals[key] / questionCounts[key];
    });

    return res.status(200).json({ uid, batchAverages, questionAverages, predictions });

  } catch (error) {
    console.error("Error calculating averages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
