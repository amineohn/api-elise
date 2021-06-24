var sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./src/database/db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS "weight" (
      "id"	INTEGER,
      "weight"	int,
      "type"	TEXT,
      PRIMARY KEY("id")
    )`);
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
