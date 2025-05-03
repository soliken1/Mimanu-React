import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FormAnswers = () => {
  const { uid } = useParams();

  const [selectedForm, setSelectedForm] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFormEndpoints = (uid) => ({
    "MBTI-Form": `/api/mbti-form?uid=${uid}`,
    "Peer Form": `/api/peer-form?uid=${uid}`,
    "Self Form": `/api/self-form?uid=${uid}`,
    "Superior Form": `/api/superior-form?uid=${uid}`,
  });

  const formEndpoints = getFormEndpoints(uid);

  const groupedQuestions = {
    "Critical Thinking": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "Time Management": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    Teamwork: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    Leadership: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    Communication: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  };

  const mbtiGroupings = {
    "Energy (Extraversion/Introversion)": "title1_4",
    "Information (Sensing/Intuition)": "title5_8",
    "Decisions (Thinking/Feeling)": "title9_12",
    "Lifestyle (Judging/Perceiving)": "title13_16",
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
          const questionObj = response[key];
          if (!questionObj) return null;
          return (
            <div key={key} className="bg-white p-4 rounded shadow-sm border">
              <p className="text-gray-800 font-medium">
                {questionObj.question}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Answer: {questionObj.answer}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMBTI = () => (
    <div className="space-y-4">
      {Object.entries(mbtiGroupings).map(([label, key]) => (
        <div key={key} className="bg-white p-4 rounded shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{label}</h2>
          <p className="text-gray-600">{response[key]}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Form Responses</h1>
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

      {!loading && selectedForm && !response && (
        <p className="text-red-500">User has not answered this form.</p>
      )}

      {!loading && response && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            Selected: {selectedForm}
          </h2>
          {selectedForm === "MBTI-Form"
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
