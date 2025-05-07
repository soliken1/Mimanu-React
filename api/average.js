export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    // Extract UID from query parameters
    const uid = req.query.uid;
    if (!uid) {
      return res.status(400).json({ error: "Missing uid parameter" });
    }
  
    // Define URLs for fetching form data from three perspectives
    const urls = [
      `https://mimanu-react.vercel.app/api/superior-form?uid=${uid}`,
      `https://mimanu-react.vercel.app/api/peer-form?uid=${uid}`,
      `https://mimanu-react.vercel.app/api/self-form?uid=${uid}`,
    ];
  
    try {
      // Fetch all forms 
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const data = await Promise.all(responses.map((r) => r.json()));
  
      // Define question batches with number ranges
      const batches = {
        "Critical Thinking": [1, 10],
        "Time Management": [11, 20],
        "Teamwork": [21, 30],
        "Leadership": [31, 40],
        "Communication": [41, 50],
      };
  
      const batchTotals = {};     // Sum of scores for each batch
      const batchCounts = {};     // Count of responses for each batch
      const questionTotals = {};  // Sum of scores per question
      const questionCounts = {};  // Count of responses per question
  
      // Process all form responses
      data.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          //Process keys like "q1", "q2", ..., "q50"
          if (key.startsWith("q")) {
            const value = entry[key];
            const answer = value && typeof value === "object" ? value.answer : value;
  
            const questionNumber = parseInt(key.slice(1), 10);
  
            // Make sure the answer is a valid number
            if (!isNaN(questionNumber) && typeof answer === "number") {
              // Aggregate per-question totals and counts
              questionTotals[key] = (questionTotals[key] || 0) + answer;
              questionCounts[key] = (questionCounts[key] || 0) + 1;
  
              // Match the question to its batch and aggregate batch data
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
  
      // Compute average score for each batch
      const batchAverages = {};
      for (const batch in batches) {
        const total = batchTotals[batch] || 0;
        const count = batchCounts[batch] || 0;
        batchAverages[batch] = count > 0 ? total / count : null;
      }
  
      // Compute average score for each question
      const questionAverages = {};
      Object.keys(questionTotals).forEach((key) => {
        questionAverages[key] = questionTotals[key] / questionCounts[key];
      });
  
      // Return the UID, batch averages, and question averages in the response
      return res.status(200).json({ uid, batchAverages, questionAverages });
  
    } catch (error) {
      // Catch any error during the process and return an error response
      console.error("Error calculating averages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  