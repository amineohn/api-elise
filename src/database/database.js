var sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./src/database/db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
