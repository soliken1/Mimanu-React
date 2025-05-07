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
  
    try {
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const data = await Promise.all(responses.map((r) => r.json()));
  
      const questionTotals = {};
      const questionCounts = {};
  
      data.forEach((entry) => {
        const answers = entry;
  
        Object.keys(answers).forEach((key) => {
          if (key.startsWith("q")) {
            const value = answers[key];
            const answer = value && typeof value === "object" ? value.answer : value;
  
            if (typeof answer === "number") {
              questionTotals[key] = (questionTotals[key] || 0) + answer;
              questionCounts[key] = (questionCounts[key] || 0) + 1;
            }
          }
        });
      });
  
      const averages = {};
      Object.keys(questionTotals).forEach((key) => {
        averages[key] = questionTotals[key] / questionCounts[key];
      });
  
      return res.status(200).json({ uid, averages });
    } catch (error) {
      console.error("Error calculating averages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  