import { useEffect, useState } from "react";
import { getData, postData } from "./helpers/fetch";
import io from "socket.io-client";

export default function App() {
  const [users, setUsers] = useState([]);
  const [myStatus, setMyStatus] = useState("available");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchStatuses = async () => {
    getData("http://localhost:3001/status")
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching statuses:", error);
      });
  };

  // const updateStatusByID = async () => {
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
    fetchStatuses();
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
    const interval = setInterval(fetchStatuses, 5000); // Fetch statuses every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>
        <center>TeamCheck</center>
      </h1>
      {users.length > 0 ? (
        <div>
          <table class="table">
            <thead>
              <tr>
                {users.map((user) => (
                  <th key={user.userID}>
                    {user.name}
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
        <div>Loading...</div>
      )}
    </div>
  );
}
