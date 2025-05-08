import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import fetchUser from "../../hooks/get/fetchUser";

const MBTI_DESCRIPTIONS = {
  ISTJ: "The Logistician – practical and fact-minded, with a strong sense of duty and responsibility.",
  ISFJ: "The Defender – warm and dedicated, always ready to protect and help others.",
  INFJ: "The Advocate – insightful and principled, with a quiet passion for helping others.",
  INTJ: "The Architect – strategic and logical, with a clear vision for the future.",
  ISTP: "The Virtuoso – bold and practical experimenters, masters of tools and techniques.",
  ISFP: "The Adventurer – gentle, sensitive, and artistic, always exploring new ways to express themselves.",
  INFP: "The Mediator – idealistic and empathetic, guided by core values and beliefs.",
  INTP: "The Logician – innovative and curious, constantly seeking understanding and truth.",
  ESTP: "The Entrepreneur – energetic and perceptive, who love living on the edge.",
  ESFP: "The Entertainer – outgoing and spontaneous, who live for excitement and fun.",
  ENFP: "The Campaigner – enthusiastic and creative free spirits, often inspiring others.",
  ENTP: "The Debater – smart and curious thinkers, who enjoy intellectual challenges.",
  ESTJ: "The Executive – organized and honest, who love bringing structure and order.",
  ESFJ: "The Consul – caring and social, always eager to help and support others.",
  ENFJ: "The Protagonist – charismatic and inspiring leaders, who love helping others grow.",
  ENTJ: "The Commander – confident and strategic, born to lead and drive success.",
};

const BAR_COLORS = {
  "Critical Thinking": "#8B8000",
  "Time Management": "#9F2B68",
  Teamwork: "#FFA500",
  Leadership: "#FF0000",
  Communication: "#0000FF",
};

const FormAnswers = () => {
  const { uid } = useParams();
  const [selectedForm, setSelectedForm] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mbtiType, setMbtiType] = useState(null);
  const [batchAverages, setBatchAverages] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewFormResults, setViewFormResults] = useState(false);
  const [viewChartAnalysis, setViewChartAnalysis] = useState(false);
  const [questionAverages, setQuestionAverages] = useState([]);
  const [groupedQuestionAveragees, setGroupQuestionAverages] = useState([]);

  const getFormEndpoints = (uid) => ({
    MBTIForm: `https://mimanu-react.vercel.app/api/mbti-form?uid=${uid}`,
    PeerForm: `https://mimanu-react.vercel.app/api/peer-form?uid=${uid}`,
    SelfForm: `https://mimanu-react.vercel.app/api/self-form?uid=${uid}`,
    SuperiorForm: `https://mimanu-react.vercel.app/api/superior-form?uid=${uid}`,
  });

  const formEndpoints = getFormEndpoints(uid);

  useEffect(() => {
    const fetchMbti = async () => {
      try {
        const res = await axios.get(formEndpoints.MBTIForm);
        if (res.data?.mbtiType) {
          setMbtiType(res.data.mbtiType);
        }
      } catch (err) {
        console.error("Failed to fetch MBTI type:", err);
      }
    };

    const fetchAverages = async () => {
      try {
        const res = await axios.get(
          `https://mimanu-react.vercel.app/api/average?uid=${uid}`
        );
        if (res.data?.batchAverages) {
          setBatchAverages(res.data.batchAverages);
        }
        if (res.data?.questionAverages) {
          setQuestionAverages(res.data.questionAverages);
        }
      } catch (err) {
        console.error("Failed to fetch batch averages:", err);
      }
    };

    const fetchSelectedUser = async () => {
      try {
        const data = await fetchUser(uid);
        console.log(data);
        setSelectedUser(data);
      } catch (err) {
        console.error("Failed to fetch MBTI type:", err);
      }
    };

    fetchSelectedUser();
    fetchMbti();
    fetchAverages();
  }, [uid]);

  const groupedQuestions = {
    "Critical Thinking": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "Time Management": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    Teamwork: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    Leadership: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    Communication: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  };

  const mbtiGroupings = {
    "Energy (Extraversion/Introversion)": [1, 2, 3, 4],
    "Information (Sensing/Intuition)": [5, 6, 7, 8],
    "Decisions (Thinking/Feeling)": [9, 10, 11, 12],
    "Lifestyle (Judging/Perceiving)": [13, 14, 15, 16],
  };

  const interpretScale = (value) => {
    switch (Number(value)) {
      case 1:
        return "Strongly Disagree";
      case 2:
        return "Disagree";
      case 3:
        return "Neutral";
      case 4:
        return "Agree";
      case 5:
        return "Strongly Agree";
      default:
        return "No interpretation";
    }
  };

  const handleFormSelect = async (formType) => {
    setSelectedForm(formType);
    setResponse(null);
    setLoading(true);
    try {
      const res = await axios.get(formEndpoints[formType]);
      if (res.data && Object.keys(res.data).length > 0) {
        setResponse(res.data);
      } else {
        setResponse(null);
      }
    } catch (err) {
      console.error("Error fetching form data:", err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const renderGroup = (title, indexes) => (
    <div key={title} className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-1">
        {title}
      </h2>
      <div className="space-y-2">
        {indexes.map((i) => {
          const key = `q${i}`;
          const questionObj = response?.[key] || response?.answers?.[key];
          if (!questionObj) return null;
          return (
            <div key={key} className="bg-white p-4 rounded shadow-sm border">
              <p className="text-gray-800 font-medium">
                {questionObj.question}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Answer: {questionObj.answer} (
                {interpretScale(questionObj.answer)})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMBTI = () => (
    <div className="space-y-4">
      {Object.entries(mbtiGroupings).map(([title, indexes]) =>
        renderGroup(title, indexes)
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h1 className="text-2xl font-bold mb-4">360 Assessment</h1>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
        <img
          src={selectedUser?.UserImg}
          alt={selectedUser?.Username}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedUser?.Username}
          </h2>
          <p className="text-sm text-gray-500">Assessed Participant</p>
        </div>
      </div>

      {/* Top Personality Display */}
      {mbtiType ? (
        <div className="bg-blue-50 p-5 mb-6 rounded border border-blue-200">
          <h2 className="text-xl font-bold text-blue-700">
            Personality Type: {mbtiType}
          </h2>
          <p className="text-gray-700 mt-2 italic">
            {MBTI_DESCRIPTIONS[mbtiType] ||
              "No description available for this type."}
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 p-5 mb-6 rounded border border-blue-200 text-blue-600 italic">
          This user hasn't taken the MBTI assessment yet.
        </div>
      )}

      {batchAverages ? (
        <div className="bg-green-50 p-5 mb-6 rounded border border-green-200">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Peer Group Averages
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.entries(batchAverages).map(([category, avg]) => ({
                category,
                average: parseFloat(avg?.toFixed(2)),
              }))}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 5]} tickCount={6} />
              <Tooltip />
              <Bar dataKey="average" barSize={40} radius={[4, 4, 0, 0]}>
                {Object.entries(batchAverages).map(([category]) => (
                  <Cell key={category} fill={BAR_COLORS[category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-green-50 p-5 mb-6 rounded border border-green-200 text-green-700 italic">
          Peer group data not available yet.
        </div>
      )}

      {/* Toggle View Button */}
      <div className="mb-6 flex flex-row justify-between">
        <button
          onClick={() => setViewFormResults(!viewFormResults)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {viewFormResults ? "Hide Raw Answers" : "View Raw Answers"}
        </button>

        <button
          onClick={() => setViewChartAnalysis(!viewChartAnalysis)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {viewChartAnalysis ? "Hide Chart Analysis" : "View Chart Analysis"}
        </button>
      </div>

      {viewChartAnalysis ? (
        <div className="space-y-10 mt-10">
          {Object.entries(groupedQuestions).map(([group, questionNums]) => {
            const data = questionNums.map((qNum) => ({
              question: `Q${qNum}`,
              average: parseFloat(
                (questionAverages?.[`q${qNum}`] || 0).toFixed(2)
              ),
            }));

            return (
              <div key={group}>
                <h3 className="text-lg font-bold text-center mb-2 text-indigo-700">
                  {group}
                </h3>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="question" />
                      <YAxis domain={[0, 5]} tickCount={6} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="#155dfc" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Form Results */}
      {viewFormResults ? (
        <div>
          <div className="flex gap-3 mb-6 flex-wrap">
            {Object.keys(formEndpoints).map((form) => (
              <button
                key={form}
                onClick={() => handleFormSelect(form)}
                className={`px-4 py-2 rounded ${
                  selectedForm === form
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {form}
              </button>
            ))}
          </div>

          {loading && <p className="text-gray-600">Loading...</p>}

          {!selectedForm && (
            <p className="text-sm text-gray-500 italic mb-4">
              Select a form above to view the user's responses.
            </p>
          )}

          {!loading && selectedForm && !response && (
            <div className="text-red-500 italic">
              🚫 This user has not answered the <b>{selectedForm}</b>.
            </div>
          )}

          {!loading && response && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Selected: {selectedForm}
              </h2>
              {selectedForm === "MBTIForm"
                ? renderMBTI()
                : Object.entries(groupedQuestions).map(([title, indexes]) =>
                    renderGroup(title, indexes)
                  )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FormAnswers;
