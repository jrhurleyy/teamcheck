import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [myStatus, setMyStatus] = useState("available");

  const fetchStatuses = async () => {
    // TODO: Fetch all users' statuses from the backend
  };

  const updateMyStatus = async () => {
    // TODO: Update the user's status in the backend
    fetchStatuses();
  };

  useEffect(() => {
    // TODO: Polling to fetch statuses every 10 seconds
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>
        <center>TeamCheck</center>
      </h1>
      {/* TODO: Implement your intefrace here*/}
    </div>
  );
}
