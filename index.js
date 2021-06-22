const express = require("express");
const app = express();
const port = 3001;
const MongoClient = require("mongodb").MongoClient;

const db;
MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  console.log("Connected successfully to server");
  db = client.db("prod");
});

app.use(express());

app.get("/session/auth", (req, res) => {
  const user = res.send({
    username: "amine",
    password: "test123",
    error: "false",
    success: "false",
  });

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid Authentication Credentials" });
  }
});
app.get("/add/weight", (req, res) => {
  res.send({ weight: "300kg" });
});
app.get("/list/weight", (req, res) => {
  res.send({
    list: ["200kg", "200kg"],
    type: ["Caisse", "Bennes"],
    data: ["Canettes", "PET"],
  });
});
app.get("/session/error", (err, res) => {
  if (typeof err === "string") {
    return res.status(400).json({ message: err });
  }

  if (!res.status(500)) {
    return res.status(500).json({ message: err.message });
  }
});
app.listen(port, () => console.log(`Listening on port ${port}`));
