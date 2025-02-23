import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebaseConfigs";
import { doc, getDoc } from "firebase/firestore";

const MBTIScreen = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "Questions", "MBTI");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuestionsData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [user]);

  const handleResponseChange = (questionKey, value) => {
    setResponses((prev) => ({ ...prev, [questionKey]: value }));
  };

  if (!questionsData) {
    return <p className="text-center mt-4 text-gray-500">Loading questions...</p>;
  }

  const sections = [
    { titleKey: "title1_4", range: [1, 4] },
    { titleKey: "title5_8", range: [5, 8] },
    { titleKey: "title9_12", range: [9, 12] },
    { titleKey: "title13_16", range: [13, 16] },
  ];

  // Scale labels
  const scaleLabels = {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">MBTI Questionnaire</h2>

      {/* Direction */}
      <p className="text-gray-700 text-sm text-center mb-6">
        <strong>Direction:</strong> Answer honestly, as there are no right or wrong answers—choose the option that best reflects your natural preferences. 
        Respond based on how you typically think, feel, and behave, rather than how you think you should act. 
        Use the entire scale; while some statements may feel neutral, try to select the option that leans slightly more toward your preference. 
        There is no time pressure, so take your time, but avoid overthinking—your first instinct is usually the most accurate. 
        Ensure you complete all questions.
      </p>

      {sections.map(({ titleKey, range }, index) => (
        <div key={index} className="mb-8">
          {/* Section Title */}
          <h3 className="text-xl font-semibold text-center bg-gray-200 p-3 rounded">
            {questionsData[titleKey]}
          </h3>

          {/* Table Structure */}
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-300 text-center">
                <th className="p-2 text-left">Question</th>
                {Object.keys(scaleLabels).map((num) => (
                  <th key={num} className="p-2">{scaleLabels[num]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => {
                const questionKey = `q${range[0] + i}`;
                return (
                  <tr key={questionKey} className="border-b text-center">
                    {/* Question */}
                    <td className="p-3 text-left font-medium">
                      {questionsData[questionKey] || `Missing question: ${questionKey}`}
                    </td>

                    {/* Richter Scale Selection (1-5) */}
                    {Object.keys(scaleLabels).map((num) => (
                      <td key={num} className="p-2">
                        <input
                          type="radio"
                          name={questionKey}
                          value={num}
                          checked={responses[questionKey] === Number(num)}
                          onChange={() => handleResponseChange(questionKey, Number(num))}
                          className="w-5 h-5"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MBTIScreen;
