import React, { useState } from "react";

const AnnouncementModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null; // If modal is closed, return nothing

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>

        {/* Title Input */}
        <label className="text-sm">Announcement Title:</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Details Input */}
        <label className="text-sm">Announcement Details:</label>
        <textarea
          className="border border-gray-300 rounded px-3 py-2 w-full h-24 mb-4"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 px-4 py-2 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#152852] px-4 py-2 text-white rounded"
            onClick={() => onSubmit(title, details)}
          >
            Add Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
