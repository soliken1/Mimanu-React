import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

const FormAnswers = () => {
  const { uid } = useParams();
  const [selectedForm, setSelectedForm] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mbtiType, setMbtiType] = useState(null);
  const [batchAverages, setBatchAverages] = useState(null);

  const getFormEndpoints = (uid) => ({
    MBTIForm: `/api/mbti-form?uid=${uid}`,
    PeerForm: `/api/peer-form?uid=${uid}`,
    SelfForm: `/api/self-form?uid=${uid}`,
    SuperiorForm: `/api/superior-form?uid=${uid}`,
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
      } catch (err) {
        console.error("Failed to fetch batch averages:", err);
      }
    };

    fetchAverages();
    fetchMbti();
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">360 Assessment</h1>

      {/* Top Personality Display */}
      {mbtiType && (
        <div className="bg-blue-50 p-5 mb-6 rounded border border-blue-200">
          <h2 className="text-xl font-bold text-blue-700">
            Personality Type: {mbtiType}
          </h2>
          <p className="text-gray-700 mt-2 italic">
            {MBTI_DESCRIPTIONS[mbtiType] ||
              "No description available for this type."}
          </p>
        </div>
      )}

      {batchAverages && (
        <div className="bg-green-50 p-5 mb-6 rounded border border-green-200">
          <h2 className="text-xl font-bold text-green-700 mb-3">
            Peer Group Averages
          </h2>
          <ul className="space-y-1 text-gray-800">
            {Object.entries(batchAverages).map(([category, avg]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-semibold">{avg.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Toggle Buttons */}
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

      {/* Form Results */}
      {loading && <p className="text-gray-600">Loading...</p>}
      {!loading && selectedForm && !response && (
        <p className="text-red-500">User has not answered this form.</p>
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
  );
};

export default FormAnswers;
