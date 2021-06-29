const express = require("express");
const cors = require("cors");
const db = require("./src/database/database");
const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express());
app.use(express.urlencoded({ extended: true }));

app.get(`/`, (req, res) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS data (
    id INTEGER,
    type TEXT, 
    weight INTEGER, 
    matter TEXT,
    PRIMARY KEY("id")
    )`,
    (err) =>
      res.json({
        database: {
          insert: true,
          message: err ? `the table as been added` : `table is already created`,
        },
      })
  );
});

app.param([`type`, `weight`, `matter`], (req, res, next) => {
  db.run(
    `INSERT INTO data (type, weight, matter) VALUES (?, ?, ?)`,
    req.params.type,
    req.params.weight,
    req.params.matter
  );
  res.json({
    weight: req.params.weight,
    type: req.params.type,
    matter: req.params.matter,
    show: "data is finally added",
  });
  next();
});

app.post(`/add/:type/:weight/:matter`, (req, res, next) => {
  next.end();
});

app.get(`/list`, (req, res) => {
  db.all(`SELECT * from data`, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows,
      error: false,
    });
  });
});

app.get(`/list/type`, (req, res) => {
  res.json({
    data: [
      {
        pallets: {
          type: `Europe`,
        },
        dumpsters: {
          type: `2 Tonnes`,
        },
      },
    ],
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
