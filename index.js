const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express());
app.get("/", function (req, res) {
  res.json({
    message: ["it work."],
  });
});
app.get("/list/weight", (req, res) => {
  res.json({
    weight: ["200kg"],
    type: ["Caisse"],
    deposit: ["Canettes"],
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
app.param(["number"], function (req, res, next, value) {
  res.status(200).json({
    weight: value,
    type: "kg",
  });
  next();
});
app.post("/add/weight/:number", (req, res) => {});
app.get("/add/weight/:number", (req, res, next) => {
  next.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
