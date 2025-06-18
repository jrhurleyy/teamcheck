import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Use the in-memory array to store user info and statuses
let users = [];

app.get("/status", (req, res) => {
  // TODO: Implement logic to get all users' statuses
});

app.get("/status/:id", (req, res) => {
  // TODO: Implement logic to get a specific user's status
});

app.post("/status/:id", (req, res) => {
  // TODO: Implement logic to update a users status
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
