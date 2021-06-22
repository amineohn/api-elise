const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  client.db("prod");
  if (client.db("prod")) {
    console.log("Connected successfully to server");
  } else {
    console.log("can't connect to MongoDB");
  }
});

app.use(express());

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

// endpoints
app.put("/session/auth", (req, res) => {});
app.delete("/session/auth", (req, res) => {});
app.post("/session/auth", (req, res) => {
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

app.post("/add/weight/:value", (req, res) => {
  res
    .status(200)
    .send({ weight: "10", type: "kg", created: true, value: "yes" });
});

app.put("/session/create", (req, res) => {});
app.delete("/session/create", (req, res) => {});
app.post("/session/create", (req, res) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));
