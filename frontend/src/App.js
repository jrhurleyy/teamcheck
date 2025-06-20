/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { getData, postData } from "./helpers/fetch";
import io from "socket.io-client";
import LoginModal from "./components/LoginModal";
import UserStatusControls from "./components/UserStatusControls";
import { API_BASE_URL, SOCKET_URL } from "./config/api";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authCredentials, setAuthCredentials] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setAuthCredentials(null);
    setIsLoggedIn(false);
    console.log("User logged out");
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await getData(`${API_BASE_URL}/status`, authCredentials);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      if (error.status === 401) {
        handleLogout();
      }
    }
  }, [authCredentials, handleLogout]);

  const fetchUserList = useCallback(async () => {
    try {
      const data = await getData(`${API_BASE_URL}/users`);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  }, []);

  const handleLogin = (user, credentials) => {
    setCurrentUser(user);
    setAuthCredentials(credentials);
    setIsLoggedIn(true);
    console.log(`User ${user.name} logged in successfully`);
  };

  const handleStatusUpdate = (newStatus) => {
    setCurrentUser((prev) => ({ ...prev, status: newStatus }));
    setUsers((prev) =>
      prev.map((user) =>
        user.userID === currentUser.userID
          ? { ...user, status: newStatus, lastUpdate: new Date() }
          : user
      )
    );
  };

  useEffect(() => {
    if (isLoggedIn && authCredentials) {
      fetchStatuses();
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
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
    } else {
      fetchUserList();
    }
  }, [isLoggedIn, authCredentials, fetchStatuses, fetchUserList]);

  useEffect(() => {
    if (!socket) return;
    socket.on("user-status-updated", (data) => {
      console.log("Received Web Socket Event -- Refreshing Users...");
      fetchStatuses();
    });
  }, [socket, fetchStatuses]);

  return (
    <div style={{ padding: 20 }}>
      <LoginModal users={users} onLogin={handleLogin} isOpen={!isLoggedIn} />
      {isLoggedIn && currentUser && (
        <>
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
          <h1>
            <center>TeamCheck</center>
          </h1>
          <UserStatusControls
            currentUser={currentUser}
            onStatusUpdate={handleStatusUpdate}
            authCredentials={authCredentials}
          />
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
                            user.status === "Online"
                              ? "bg-success"
                              : user.status === "Offline"
                              ? "bg-secondary"
                              : user.status === "In a Meeting"
                              ? "bg-danger"
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
          <div
            className="socket-status-container"
            style={{
              background: isConnected ? "#d4edda" : "#f8d7da",
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
