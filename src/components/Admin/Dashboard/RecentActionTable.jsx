import React, { useState } from "react";

const RecentActionTable = ({ enrolleeActionsData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Flatten screenTimeEntries with user details
  const flattenedData = enrolleeActionsData.flatMap((user) =>
    user.screenTimeEntries.map((entry) => ({
      name: user.name,
      profile: user.profile,
      screen: entry.screen,
      duration: entry.duration,
      timestamp: entry.timestamp,
    }))
  );

  // Sort by most recent timestamp (descending)
  const sortedData = flattenedData.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} mins`;
  };

  return (
    <div className="w-full overflow-x-auto text-sm mt-2">
      <table className="min-w-full border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 font-light py-2">User Profile</th>
            <th className="px-4 font-light py-2">Screen</th>
            <th className="px-4 font-light py-2">Duration</th>
            <th className="px-4 font-light py-2">Time Triggered</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="border-gray-200 border-b">
              <td className="px-4 py-2 flex items-center space-x-2">
                <img
                  src={item.profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{item.name}</span>
              </td>
              <td className="px-4 py-2">{item.screen}</td>
              <td className="px-4 py-2">{formatTime(item.duration)}</td>
              <td className="px-4 py-2">
                {new Date(item.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⏪ First
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="px-4 py-1 bg-gray-200 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⏩ Last
        </button>
      </div>
    </div>
  );
};

export default RecentActionTable;
