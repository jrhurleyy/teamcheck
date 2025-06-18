import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Use the in-memory array to store user info and statuses
let users = [{ userID: 1, name: "John Doe", status: "active", lastUpodate: new Date() }];

app.get("/status", (req, res) => {
  res.json(users);
});

app.get("/status/:id", (req, res) => {
  users.find(user => user.userID === parseInt(req.params.id))
    ? res.json(users.find(user => user.userID === parseInt(req.params.id)))
    : res.status(404).send("User not found");
});

app.post("/status/:id", (req, res) => {
  const user = users.find(user => user.userID === parseInt(req.params.id));
  if (user) {
    user.status = req.body.status;
    user.lastUpdate = new Date();
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
