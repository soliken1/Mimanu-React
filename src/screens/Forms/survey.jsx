import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";

const TMSFormScreen = () => {
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState({});
  const { uid } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser && currentUser.uid === uid) {
        setUser(currentUser);

        // Fetch custom Username from Firestore
        try {
          const userDocRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser((prev) => ({ ...prev, Username: userData.Username }));
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        toast.error("Unauthorized Attempt", {
          position: "bottom-right",
          autoClose: 3000,
          transition: Bounce,
        });
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const sections = [
    {
      title: "TMS Platform Experience",
      questions: [
        {
          key: "q1",
          text: "Ease of Account Setup",
          options: [
            "Very Easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very Difficult",
          ],
        },
        {
          key: "q2",
          text: "Clarity of Onboarding Instructions (if applicable)",
          options: [
            "Very Clear",
            "Clear",
            "Neutral",
            "Unclear",
            "Very Unclear",
            "Not Applicable",
          ],
        },
        {
          key: "q3",
          text: "Time Taken to Get Started",
          options: ["Very Quick", "Quick", "Moderate", "Slow", "Very Slow"],
        },
        {
          key: "q4",
          text: "Ease of Navigation",
          options: [
            "Very Easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very Difficult",
          ],
        },
        {
          key: "q5",
          text: "Menu Structure & Organisation",
          options: [
            "Very Logical",
            "Logical",
            "Neutral",
            "Illogical",
            "Very Illogical",
          ],
        },
        {
          key: "q6",
          text: "Speed of Platform Load Time",
          options: ["Very Fast", "Fast", "Moderate", "Slow", "Very Slow"],
        },
        {
          key: "q7",
          text: "Clarity of Learning Material",
          options: [
            "Very Clear",
            "Clear",
            "Neutral",
            "Unclear",
            "Very Unclear",
            "Not Applicable",
          ],
        },
        {
          key: "q8",
          text: "Engagement Level of Content",
          options: [
            "Very Engaging",
            "Engaging",
            "Neutral",
            "Not Engaging",
            "Very Unengaging",
            "Not Applicable",
          ],
        },
        {
          key: "q9",
          text: "Content Relevance to My Goals",
          options: [
            "Very Relevant",
            "Relevant",
            "Neutral",
            "Irrelevant",
            "Very Irrelevant",
            "Not Applicable",
          ],
        },
        {
          key: "q10",
          text: "Functionality of Key Features",
          options: [
            "Very Functional",
            "Functional",
            "Neutral",
            "Not Functional",
            "Very Non-Functional",
            "Not Applicable",
          ],
        },
        {
          key: "q11",
          text: "Mobile Platform Usability",
          options: [
            "Very Usable",
            "Usable",
            "Neutral",
            "Not Usable",
            "Very Unusable",
            "Not Applicable",
          ],
        },
        {
          key: "q12",
          text: "Frequency of Technical Issues",
          options: [
            "Never",
            "Rarely",
            "Occasionally",
            "Frequently",
            "Very Frequently",
          ],
        },
        {
          key: "q13",
          text: "Ease of Accessing Support",
          options: [
            "Very Easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very Difficult",
          ],
        },
        {
          key: "q14",
          text: "Responsiveness of Support",
          options: [
            "Very Responsive",
            "Responsive",
            "Neutral",
            "Unresponsive",
            "Very Unresponsive",
            "Not Applicable",
          ],
        },
        {
          key: "q15",
          text: "Overall User Experience Rating (1 to 5)",
          options: ["1", "2", "3", "4", "5"],
        },
        {
          key: "q16",
          text: "Would You Recommend TMS?",
          options: ["Yes", "Maybe", "No"],
        },
      ],
    },
    {
      title: "Course Content Experience",
      questions: [
        {
          key: "q17",
          text: "Clarity of Course Objectives",
          options: [
            "Very Clear",
            "Clear",
            "Neutral",
            "Unclear",
            "Very Unclear",
            "Not Applicable",
          ],
        },
        {
          key: "q18",
          text: "Structure and Flow of the Course",
          options: [
            "Very Logical",
            "Logical",
            "Neutral",
            "Illogical",
            "Very Illogical",
            "Not Applicable",
          ],
        },
        {
          key: "q19",
          text: "Depth of Content",
          options: [
            "Very Comprehensive",
            "Comprehensive",
            "Adequate",
            "Inadequate",
            "Very Inadequate",
          ],
        },
        {
          key: "q20",
          text: "Practicality and Real-World Application",
          options: [
            "Very Applicable",
            "Applicable",
            "Neutral",
            "Not Applicable",
          ],
        },
        {
          key: "q21",
          text: "Engagement and Interactivity",
          options: [
            "Very Engaging",
            "Engaging",
            "Neutral",
            "Not Engaging",
            "Very Unengaging",
            "Not Applicable",
          ],
        },
        {
          key: "q22",
          text: "Quality of Visuals and Multimedia",
          options: [
            "Very High Quality",
            "High Quality",
            "Neutral",
            "Low Quality",
            "Very Low Quality",
            "Not Applicable",
          ],
        },
        {
          key: "q23",
          text: "Clarity of Assessment Tools",
          options: [
            "Very Clear",
            "Clear",
            "Neutral",
            "Unclear",
            "Very Unclear",
            "Not Applicable",
          ],
        },
        {
          key: "q24",
          text: "Effectiveness of Course Materials",
          options: [
            "Very Useful",
            "Useful",
            "Neutral",
            "Not Useful",
            "Very Not Useful",
            "Not Applicable",
          ],
        },
        {
          key: "q25",
          text: "Instructor/Facilitator Effectiveness",
          options: [
            "Very Effective",
            "Effective",
            "Neutral",
            "Ineffective",
            "Very Ineffective",
            "Not Applicable",
          ],
        },
        {
          key: "q26",
          text: "Overall Satisfaction",
          options: [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied",
          ],
        },
      ],
    },
    {
      title: "Open-Ended Feedback",
      questions: [
        {
          key: "q27",
          text: "Most helpful aspects of the course",
          type: "text",
        },
        { key: "q28", text: "Areas needing improvement", type: "text" },
        { key: "q29", text: "Other comments/suggestions", type: "text" },
      ],
    },
    {
      title: "Recommendation",
      questions: [
        {
          key: "q30",
          text: "Would you recommend this course?",
          options: ["Yes", "No"],
        },
      ],
    },
  ];

  const handleChange = (key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!agreed) {
      toast.warning("Please agree to the privacy notice to continue.", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    if (!user) return;
    const formRef = collection(db, "Form-Answers");
    const q = query(
      formRef,
      where("formType", "==", "Survey"),
      where("answeredBy", "==", user.uid)
    );

    try {
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error("You've already submitted this form.", {
          position: "bottom-right",
          theme: "colored",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/dashboard"), 3000);
        return;
      }

      const requiredKeys = sections.flatMap((s) =>
        s.questions.filter((q) => q.type !== "text").map((q) => q.key)
      );
      const allFilled = requiredKeys.every((key) => responses[key]);
      if (!allFilled) {
        toast.warning("Please complete all required questions.", {
          position: "bottom-right",
          theme: "colored",
          autoClose: 3000,
        });
        return;
      }

      const formatted = {
        uid: user.uid,
        formType: "Survey",
        answeredBy: user.uid,
        answered: true,
        course: courseId,
        timestamp: Date.now(),
        ...responses,
      };

      await setDoc(doc(formRef), formatted);

      toast.success("Thank you for your feedback!", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Try again.", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Training Management System (TMS) Survey
      </h2>
      <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
        <p className="mb-4">
          Thank you for taking the time to provide feedback on your experience
          with our Training Management System (TMS). Your input is valuable in
          helping us improve the platform, the content of our courses, and the
          overall learning experience.
        </p>
        <p className="mb-4 font-semibold">DATA PRIVACY NOTIFICATION:</p>
        <p className="mb-4">
          In line with the Data Privacy Act of 2012, the company is committed to
          protecting and securing personal information obtained in the process
          of performing its mandate. The personal information you provide herein
          will be processed and utilized for documentation, data analytics,
          assessment, and monitoring. Collected personal information will be
          kept/stored and accessed only by authorized company personnel and will
          not be shared with any outside parties unless written consent is
          secured.
        </p>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to provide my personal information
          </label>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <strong>DATE:</strong> {new Date().toLocaleString()}
          </p>
          {user && (
            <p>
              <strong>USERNAME:</strong> {user.Username || user.email}
            </p>
          )}
        </div>
      </div>
      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-semibold mb-2 bg-gray-100 p-2 rounded">
            {section.title}
          </h3>
          {section.questions.map((q) => (
            <div key={q.key} className="mb-4">
              <p className="font-medium">{q.text}</p>
              {q.type === "text" ? (
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={responses[q.key] || ""}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                />
              ) : (
                <div className="flex flex-wrap gap-4 mt-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.key}
                        value={opt}
                        checked={responses[q.key] === opt}
                        onChange={() => handleChange(q.key, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TMSFormScreen;
