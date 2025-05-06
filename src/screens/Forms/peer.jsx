import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebaseConfigs";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const PeerFormScreen = () => {
  const navigate = useNavigate();

  const [questionsData, setQuestionsData] = useState(null);
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState({});
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "Questions", "peer-assessment");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuestionsData(docSnap.data());
        } else {
          console.log("No questions found.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleResponseChange = (questionKey, value) => {
    setResponses((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleSubmit = async () => {
    const uidFromParams = searchParams.get("uid");
    const usernameFromParams = searchParams.get("username");

    const formIdentifier = uidFromParams || usernameFromParams; // Use either uid or fallback to username
    if (!formIdentifier) {
      toast.error("Missing user identifier. Please use a valid form link.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    // Prepare the query to check for duplicates
    const formAnswersRef = collection(db, "Form-Answers");
    const q = query(
      formAnswersRef,
      where("formType", "==", "PeerForm"),
      where("uid", "==", formIdentifier)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setResponses({});
        toast.error("You've already submitted this questionnaire.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => navigate("/dashboard"), 3000);
        return;
      }

      const expectedKeys = Object.keys(questionsData).filter((key) =>
        key.startsWith("q")
      );
      const allAnswered = expectedKeys.every(
        (key) =>
          responses[key] !== undefined &&
          responses[key] !== null &&
          responses[key] !== ""
      );

      if (!allAnswered) {
        toast.warning("Please answer all questions before submitting.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const formattedResponses = {
        uid: formIdentifier,
        answered: true,
        formType: "PeerForm",
        answeredBy: user?.uid || "anonymous",
      };

      Object.entries(responses).forEach(([questionKey, answerValue]) => {
        formattedResponses[questionKey] = {
          question: questionsData[questionKey] || "Missing question text",
          answer: answerValue,
        };
      });

      const docRef = doc(formAnswersRef); // Auto-generated ID
      await setDoc(docRef, formattedResponses);

      toast.success("Answers submitted successfully. Thank you!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });

      setResponses({});
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      console.error("Error submitting peer form:", error);
      toast.error("Submission failed. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  if (!questionsData) {
    return (
      <p className="text-center mt-4 text-gray-500">Loading questions...</p>
    );
  }

  const sections = [
    { titleKey: "title1_10", range: [1, 10] },
    { titleKey: "title11_20", range: [11, 20] },
    { titleKey: "title21_30", range: [21, 30] },
    { titleKey: "title31_40", range: [31, 40] },
    { titleKey: "title41_50", range: [41, 50] },
  ];

  const scaleLabels = {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Immediate Superior Assessment Questionnaire
      </h2>

      <p className="text-gray-700 text-sm text-center mb-6">
        <strong>Direction:</strong> Answer each question below honestly.
      </p>

      {sections.map(({ titleKey, range }, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-semibold text-center bg-gray-200 p-3 rounded">
            {questionsData[titleKey]}
          </h3>

          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-300 text-center">
                <th className="p-2 text-left">Question</th>
                {Object.keys(scaleLabels).map((num) => (
                  <th key={num} className="p-2">
                    {scaleLabels[num]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => {
                const questionKey = `q${range[0] + i}`;
                return (
                  <tr key={questionKey} className="border-b text-center">
                    <td className="p-3 text-left font-medium">
                      {questionsData[questionKey] || `Missing: ${questionKey}`}
                    </td>
                    {Object.keys(scaleLabels).map((num) => (
                      <td key={num} className="p-2">
                        <input
                          type="radio"
                          name={questionKey}
                          value={num}
                          checked={responses[questionKey] === Number(num)}
                          onChange={() =>
                            handleResponseChange(questionKey, Number(num))
                          }
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

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Assessment
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PeerFormScreen;
