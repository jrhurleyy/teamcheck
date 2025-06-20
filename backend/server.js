import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.68.104:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
const server = http.createServer(app);
app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: corsOptions
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Use the in-memory array to store user info and statuses
let users = [
  {
    userID: 1,
    name: "John Doe",
    login: "john.doe",
    status: "Away",
    lastUpdate: new Date(),
  },
  {
    userID: 2,
    login: "jane.smith",
    name: "Jane Smith",
    status: "In a Meeting",
    lastUpdate: new Date(),
  },
  {
    userID: 3,
    login: "jim.brown",
    name: "Jim Brown",
    status: "Offline",
    lastUpdate: new Date(),
  },
  {
    userID: 4,
    login: "alice.johnson",
    name: "Alice Johnson",
    status: "Offline",
    lastUpdate: new Date(),
  },
  {
    userID: 5,
    login: "bob.lee",
    name: "Bob Lee",
    status: "Online",
    lastUpdate: new Date(),
  },
  {
    userID: 6,
    login: "charlie.kim",
    name: "Charlie Kim",
    status: "In a Meeting",
    lastUpdate: new Date(),
  },
  {
    userID: 7,
    login: "diana.prince",
    name: "Diana Prince",
    status: "In a Meeting",
    lastUpdate: new Date(),
  },
  {
    userID: 8,
    login: "ethan.hunt",
    name: "Ethan Hunt",
    status: "Online",
    lastUpdate: new Date(),
  },
];

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    if (!username) {
      return res.status(401).json({ error: "Username is required" });
    }

    const validUser = users.find(
      (user) => user.login.toLowerCase() === username.toLowerCase()
    );
    if (!validUser) {
      return res.status(401).json({ error: "Invalid username" });
    }

    if (!password) {
      return res.status(401).json({ error: "Password is required" });
    }

    req.authenticatedUser = validUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication format" });
  }
};

app.get("/status", cors(corsOptions), authenticate, (req, res) => {
  res.json(users);
});

app.post("/status/:id", authenticate, (req, res) => {
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

  io.emit("user-status-updated", {
    userId: parseInt(userId),
    status: status,
    user: users[userIndex],
  });

  res.json({
    message: "Status updated successfully",
    user: users[userIndex],
  });
});

app.get("/users", cors(corsOptions), (req, res) => {
  const userList = users.map((user) => ({
    userID: user.userID,
    name: user.name,
    login: user.login,
  }));
  res.json(userList);
});

server.listen(3001, () =>
  console.log("API and Socket.IO running on http://localhost:3001")
);
