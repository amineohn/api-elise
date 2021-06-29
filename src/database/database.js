var sql = require("sqlite3").verbose();
const db = new sql.Database("./src/database/db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
