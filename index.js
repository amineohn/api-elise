const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express());
app.get("/", (res, req) => {
  res.status(200).send("it work.");
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

app.post("/add/weight/:number", (req, res) => {
  res.status(200).json({
    weight: "10",
    type: "kg",
    created: true,
    value: "yes",
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
