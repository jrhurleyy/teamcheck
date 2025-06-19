import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000", // React dev server
    "http://127.0.0.1:3000", // Alternative localhost
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you need to send cookies/auth headers
};

// Use the in-memory array to store user info and statuses
let users = [
  { userID: 1, name: "John Doe", status: "online", lastUpdate: new Date() },
  {
    userID: 2,
    name: "Jane Smith",
    status: "in a meeting",
    lastUpdate: new Date(),
  },
  { userID: 3, name: "Jim Brown", status: "offline", lastUpdate: new Date() },
  {
    userID: 4,
    name: "Alice Johnson",
    status: "offline",
    lastUpdate: new Date(),
  },
  { userID: 5, name: "Bob Lee", status: "online", lastUpdate: new Date() },
  {
    userID: 6,
    name: "Charlie Kim",
    status: "in a meeting",
    lastUpdate: new Date(),
  },
  {
    userID: 7,
    name: "Diana Prince",
    status: "in a meeting",
    lastUpdate: new Date(),
  },
  { userID: 8, name: "Ethan Hunt", status: "online", lastUpdate: new Date() },
];

app.get("/status", cors(corsOptions), (req, res) => {
  res.json(users);
});

app.get("/status/:id", cors(corsOptions), (req, res) => {
  users.find((user) => user.userID === parseInt(req.params.id))
    ? res.json(users.find((user) => user.userID === parseInt(req.params.id)))
    : res.status(404).send("User not found");
});

app.post("/status/:id", (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;
  const userIndex = users.findIndex((user) => user.userID === parseInt(userId));

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      userId: userId,
    });
  }
  users[userIndex].status = status;
  users[userIndex].lastUpdate = new Date();
  res.json({
    message: "Status updated successfully",
    user: users[userIndex],
  });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
