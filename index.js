const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const db = require("./src/database/database");

app.use(cors());
app.use(express());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: ["it work."],
  });
});

app.param(["type", "weight"], (req, res, next, value, value2) => {
  db.run("INSERT INTO weight (weight, type) VALUES (?, ?)", value, value2);
  res.json({
    weight: value,
    type: value2,
  });
  next();
});

app.post("/add/:type/:weight", (req, res, next) => {
  next.end();
});
app.get("/list/weight", (req, res) => {
  db.all("SELECT * from weight", (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/list/weight", (res, req) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));
