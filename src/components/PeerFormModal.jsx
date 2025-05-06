import React, { useState } from "react";
import sendFormToEmail from "../utils/sendFormtoEmail";

const PeerFormModal = ({
  isOpen,
  onClose,
  users,
  selectedPeers,
  setSelectedPeers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [formType, setFormType] = useState("Peer Form");
  const [count, setCount] = useState(0);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSelectUser = (user) => {
    if (
      selectedPeers.length < count &&
      !selectedPeers.find((u) => u.UID === user.UID)
    ) {
      setSelectedPeers([...selectedPeers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedPeers(selectedPeers.filter((user) => user.UID !== userId));
  };

  const handleSendEmail = () => {
    sendFormToEmail({ email, formType });
    setShowEmailModal(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.Username.toLowerCase().includes(searchQuery) ||
      user.FirstName.toLowerCase().includes(searchQuery) ||
      user.LastName.toLowerCase().includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          showEmailModal ? "blur-xs" : ""
        } bg-gray-900 bg-opacity-50 z-40`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative z-50">
          <h2 className="text-lg font-bold mb-4">Send Form</h2>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Form Type:</label>
            <select
              value={formType}
              onChange={(e) => {
                setFormType(e.target.value);
                const listCount = e.target.value === "Peer Form" ? 2 : 1000;
                setCount(listCount);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="Peer Form">Peer Form</option>
              <option value="Superior Form">Superior Form</option>
            </select>
          </div>

          <div className="mb-4 p-2 border rounded bg-gray-100 flex flex-col gap-2 overflow-y-auto max-h-32">
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

          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border rounded mb-3"
            value={searchQuery}
            onChange={handleSearch}
          />

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

          <div className="flex justify-between gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowEmailModal(true)}
            >
              Send Via Email
            </button>
            <div className="flex flex-row gap-2">
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
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h3 className="text-lg font-bold mb-2">Send to Email</h3>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeerFormModal;
