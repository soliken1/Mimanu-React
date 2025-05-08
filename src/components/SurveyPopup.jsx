import React from "react";

const SurveyPopup = ({ show, onClose, onRedirect }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4">We value your feedback!</h2>
        <p className="mb-4">
          Would you like to take a short survey to help us improve?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={onRedirect}
          >
            Take Survey
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPopup;
