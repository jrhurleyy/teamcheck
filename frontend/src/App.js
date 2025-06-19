import { useEffect, useState } from "react";
import { getData, postData } from "./helpers/fetch";
import io from "socket.io-client";
import LoginModal from "./components/LoginModal";
import UserStatusControls from "./components/UserStatusControls";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchStatuses = async () => {
    try {
      const data = await getData("http://localhost:3001/status");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    console.log(`User ${user.name} logged in successfully`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  const handleStatusUpdate = (newStatus) => {
    // Update the current user's status in the local state
    setCurrentUser((prev) => ({ ...prev, status: newStatus }));

    // Update the users array to reflect the change
    setUsers((prev) =>
      prev.map((user) =>
        user.userID === currentUser.userID
          ? { ...user, status: newStatus, lastUpdate: new Date() }
          : user
      )
    );
  };

  // const updateStatusByID = async (userID) => {
  //   postData(`http://localhost:3001/status/${userID}`, { status: myStatus })
  //     .then((data) => {
  //       console.log("Status updated:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating status:", error);
  //     });
  //   fetchStatuses();
  // };

  useEffect(() => {
    // Always fetch users for login validation
    fetchStatuses();

    // Only setup socket connection after login
    if (isLoggedIn) {
      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);

      // Connection event handlers
      newSocket.on("connect", () => {
        console.log("Connected to server!");
        setIsConnected(true);
        setMessages((prev) => [...prev, "Connected to server!"]);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
        setMessages((prev) => [...prev, "Disconnected from server"]);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!socket) return;
    socket.on("user-status-updated", (data) => {
      console.log("Received Web Socket Event -- Refreshing Users...");
      fetchStatuses();
    });
  }, [socket]);

  return (
    <div style={{ padding: 20 }}>
      {/* Login Modal - shown when not logged in */}
      <LoginModal users={users} onLogin={handleLogin} isOpen={!isLoggedIn} />

      {/* Main App Content - shown only when logged in */}
      {isLoggedIn && currentUser && (
        <>
          {/* User Info and Logout */}
          <div className="user-info">
            <h4>Welcome, {currentUser.name}!</h4>
            <p>
              Status: <strong>{currentUser.status}</strong>
            </p>
            <p>Connected: {isConnected ? "🟢 Yes" : "🔴 No"}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Main Header */}
          <h1>
            <center>TeamCheck</center>
          </h1>

          {/* Status Controls - Only for current user */}
          <UserStatusControls
            currentUser={currentUser}
            onStatusUpdate={handleStatusUpdate}
          />

          {/* Team Status Table */}
          {users.length > 0 ? (
            <div>
              <h2>Team Status</h2>
              <table className="table">
                <thead>
                  <tr>
                    {users.map((user) => (
                      <th key={user.userID}>
                        {user.name}
                        {user.userID === currentUser.userID && (
                          <span style={{ color: "#007acc", marginLeft: "5px" }}>
                            (You)
                          </span>
                        )}
                        <br />
                        <span
                          className={`badge ${
                            user.status === "online"
                              ? "bg-success"
                              : user.status === "offline"
                              ? "bg-secondary"
                              : "bg-warning"
                          }`}
                        >
                          {user.status}
                        </span>
                        <br />
                        <small>
                          Last updated:{" "}
                          {new Date(user.lastUpdate).toLocaleTimeString()}
                        </small>
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          ) : (
            <div>Loading team data...</div>
          )}

          {/* Connection Status */}
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              background: isConnected ? "#d4edda" : "#f8d7da",
              padding: "10px",
              borderRadius: "5px",
              border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            Socket: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </div>
        </>
      )}
    </div>
  );
}
