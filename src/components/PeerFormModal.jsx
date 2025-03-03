import React, { useState } from "react";

const PeerFormModal = ({
  isOpen,
  onClose,
  users,
  selectedPeers,
  setSelectedPeers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSelectUser = (user) => {
    if (
      selectedPeers.length < 2 &&
      !selectedPeers.find((u) => u.UID === user.UID)
    ) {
      setSelectedPeers([...selectedPeers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedPeers(selectedPeers.filter((user) => user.UID !== userId));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.Username.toLowerCase().includes(searchQuery) ||
      user.FirstName.toLowerCase().includes(searchQuery) ||
      user.LastName.toLowerCase().includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Select Peer Users</h2>

        {/* Selected Users Display */}
        <div className="mb-4 p-2 border rounded bg-gray-100 flex flex-col gap-2 h-32">
          {selectedPeers.length > 0 ? (
            selectedPeers.map((user) => (
              <div
                key={user.UID}
                className="flex items-center justify-between p-2 bg-gray-200 rounded"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.UserImg}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>
                    {user.FirstName} {user.LastName}{" "}
                    <label className="text-gray-500">@{user.Username}</label>
                  </span>
                </div>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => handleRemoveUser(user.UID)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No users selected</span>
          )}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border rounded mb-3"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* User Dropdown List */}
        <div className="max-h-40 overflow-y-auto border rounded">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.UID}
                className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 ${
                  selectedPeers.find((u) => u.UID === user.UID)
                    ? "bg-gray-300"
                    : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <img
                  src={user.UserImg}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>
                  {user.FirstName} {user.LastName}{" "}
                  <label className="text-gray-500">@{user.Username}</label>
                </span>
              </div>
            ))
          ) : (
            <p className="text-center p-2 text-gray-500">No users found</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeerFormModal;
