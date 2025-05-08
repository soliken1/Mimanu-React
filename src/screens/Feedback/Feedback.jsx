import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import NavSidebar from "../../components/NavSidebar";
import fetchUser from "../../hooks/get/fetchUser";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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
        options: ["Very Applicable", "Applicable", "Neutral", "Not Applicable"],
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

const Feedback = ({ getUser }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser(getUser.uid);
        setUserData(user);

        const q = query(
          collection(db, "Form-Answers"),
          where("formType", "==", "Survey")
        );
        const querySnapshot = await getDocs(q);

        const sectionOptionCounts = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sections.forEach((section) => {
            if (section.title === "Open-Ended Feedback") return;

            section.questions.forEach((question) => {
              const answer = data[question.key];
              if (!answer || typeof answer !== "string") return;

              const sectionTitle = section.title;
              if (!sectionOptionCounts[sectionTitle]) {
                sectionOptionCounts[sectionTitle] = {};
              }

              if (!sectionOptionCounts[sectionTitle][answer]) {
                sectionOptionCounts[sectionTitle][answer] = 0;
              }

              sectionOptionCounts[sectionTitle][answer]++;
            });
          });
        });

        const formatted = Object.entries(sectionOptionCounts).map(
          ([section, options]) => ({
            section,
            ...options,
          })
        );

        setChartData(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:pb-0 pb-20 poppins-normal">
      <NavSidebar userData={userData} />
      <div className="w-full md:ps-66 lg:ps-72 xl:ps-80 h-auto min-h-screen flex flex-row md:p-12 bg-[#FAF9F6]">
        <div className="w-full flex flex-col md:p-0 px-4 pt-12 md:px-0 md:pt-0">
          <div className="w-full h-[800px]">
            <h2 className="text-xl font-bold text-center mb-4">
              Survey Feedback Summary
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="75%">
                <BarChart layout="vertical" data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="section" width={200} />
                  <Tooltip />
                  {[
                    "Very Easy",
                    "Easy",
                    "Neutral",
                    "Difficult",
                    "Very Difficult",
                    "Very Clear",
                    "Clear",
                    "Unclear",
                    "Very Unclear",
                    "Very Engaging",
                    "Engaging",
                    "Not Engaging",
                    "Very Unengaging",
                    "Very High Quality",
                    "High Quality",
                    "Low Quality",
                    "Very Low Quality",
                    "Not Applicable",
                    "Yes",
                    "No",
                    "Maybe",
                  ].map((option, index) => (
                    <Bar
                      key={option}
                      dataKey={option}
                      stackId="a"
                      fill={`hsl(${(index * 30) % 360}, 60%, 60%)`}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No data available for chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
