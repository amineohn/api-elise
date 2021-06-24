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

/*app.param(["number"], (req, res, next, value) => {
  db.run("INSERT INTO weight (weight) VALUES (?)", value);
  res.json({
    weight: value,
  });
  next();
});*/

app.param(["weight"], (req, res, next, value) => {
  db.run("INSERT INTO weight (weight) VALUES (?)", value);
  res.json({
    weight: value,
  });
  next();
});
app.param(["type"], (req, res, next, value) => {
  db.run("INSERT INTO weight (type) VALUES (?)", value);
  res.json({
    type: value,
  });
  next();
});

app.post("/weight/:type/:weight", (req, res, next, value) => {
  req.params["type"];
  req.params["weight"];

  next.end();
});
app.get("/weight", (req, res) => {
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
