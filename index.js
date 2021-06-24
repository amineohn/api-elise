const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
var db = require("./src/database/database");

app.use(cors());
app.use(express());
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.json({
    message: ["it work."],
  });
});
app.param(["number"], function (req, res, next, value) {
  db.run("INSERT INTO weight (weight) VALUES (?)", value);
  res.json({
    weight: value,
  });
  next();
});
app.post("/weight/:number", function (req, res, next, value) {
  next.end();
});
app.get("/weight", (req, res) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS weight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight int)`
  );
  var params = [];
  db.all("SELECT * from weight", params, (err, rows) => {
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
app.get("/list/weight", function (res, req) {});

app.listen(port, () => console.log(`Listening on port ${port}`));
