import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebaseConfigs";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";

const SuperiorFormScreen = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState({});
  const [assessedUser, setAssessedUser] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const uidParam = searchParams.get("uid");
  const usernameParam = searchParams.get("username");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ?? null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "Questions", "sup-assessment");
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
  }, []);

  useEffect(() => {
    const fetchAssessedUser = async () => {
      try {
        let userDocSnap;

        if (uidParam) {
          // Look up by UID
          userDocSnap = await getDoc(doc(db, "Users", uidParam));
        } else if (usernameParam) {
          // Look up by Username
          const q = query(
            collection(db, "Users"),
            where("Username", "==", usernameParam)
          );
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            userDocSnap = querySnap.docs[0];
          }
        }

        if (userDocSnap?.exists()) {
          const data = userDocSnap.data();
          setAssessedUser(data);
        } else {
          console.log("Assessed user not found.");
        }
      } catch (error) {
        console.error("Error fetching assessed user:", error);
      }
    };

    if (uidParam || usernameParam) fetchAssessedUser();
  }, [uidParam, usernameParam]);

  const handleResponseChange = (questionKey, value) => {
    setResponses((prev) => ({ ...prev, [questionKey]: value }));
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

  const handleSubmit = async () => {
    // Prepare the query to check for duplicates
    const formAnswersRef = collection(db, "Form-Answers");
    const q = query(
      formAnswersRef,
      where("formType", "==", "SuperiorForm"),
      where("uid", "==", assessedUser?.UID ?? "")
    );

    try {
      // Execute the query to check for existing submissions
      const querySnapshot = await getDocs(q);

      // If a document already exists with the same formType and answeredBy
      if (!querySnapshot.empty) {
        setResponses({});
        toast.error(
          "You've already submitted this questionnaire. Contact your admin for validation",
          {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
          }
        );

        // Navigate to the dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000); // You can adjust the delay time here
        return;
        return;
      }

      // Check if all questions are answered
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
        toast.warning("Please answer all questions before submitting", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      // Prepare the data to save
      const formattedResponses = {
        uid: assessedUser?.UID ?? "",
        answered: true,
        formType: "SuperiorForm",
        answeredBy: user?.uid || uidParam || usernameParam || "anonymous",
      };

      Object.entries(responses).forEach(([questionKey, answerValue]) => {
        formattedResponses[questionKey] = {
          question: questionsData[questionKey] || "Missing question text",
          answer: answerValue,
        };
      });

      // Save the data with Firestore's auto-generated ID
      const docRef = doc(formAnswersRef); // Firestore auto generates ID
      await setDoc(docRef, formattedResponses);

      toast.success("Answers successfully submitted. Thank you!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });

      // Clear the form
      setResponses({});

      // Delay navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error saving answers:", error);
      toast.error(
        "An error occurred while saving your answers. Please try again.",
        {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Immediate Superior Assessment Questionnaire
      </h2>

      {assessedUser && (
        <p className="text-sm text-gray-600 text-center mb-4">
          Assessing: <strong>{assessedUser.Username ?? "Unnamed User"}</strong>
        </p>
      )}

      <p className="text-gray-700 text-sm text-center mb-6">
        <strong>Direction:</strong> Here are ten self-assessment questions for
        each of the five soft skill areas: Critical Thinking, Time Management,
        Teamwork, Leadership, and Communication.
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
                      {questionsData[questionKey] ||
                        `Missing question: ${questionKey}`}
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
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#152852] hover:bg-[#1a3266] text-white font-bold py-2 px-6 rounded-lg"
        >
          Submit Answers
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuperiorFormScreen;
