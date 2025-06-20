import React, { useState } from "react";
import { postData } from "../helpers/fetch";
import { API_BASE_URL } from "../config/api";

const UserStatusControls = ({
  currentUser,
  onStatusUpdate,
  authCredentials,
}) => {
  const [newStatus, setNewStatus] = useState(currentUser.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: "Online", label: "🟢 Online" },
    { value: "Offline", label: "⚫ Offline" },
    { value: "Away", label: "🟡 Away" },
    { value: "In a Meeting", label: "📅 In a Meeting" },
  ];

  const handleStatusUpdate = async () => {
    if (newStatus === currentUser.status) return;

    setIsUpdating(true);
    try {
      await postData(
        `${API_BASE_URL}/status/${currentUser.userID}`,
        {
          status: newStatus,
        },
        authCredentials
      );
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      setNewStatus(currentUser.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="status-controls">
      <h3>Update Your Status</h3>
      <div>
        <select
          className="status-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          disabled={isUpdating}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className="update-button"
          onClick={handleStatusUpdate}
          disabled={isUpdating || newStatus === currentUser.status}
        >
          {isUpdating ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

export default UserStatusControls;
