const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("database.db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* DATABASE SETUP */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price TEXT,
      location TEXT,
      seller TEXT,
      description TEXT
    )
  `);
});

/* ADD ITEM */
app.post("/items", (req, res) => {
  const { name, price, location, seller, description } = req.body;

  db.run(
    "INSERT INTO items VALUES (NULL, ?, ?, ?, ?, ?)",
    [name, price, location, seller, description],
    () => res.json({ success: true })
  );
});

/* GET ALL ITEMS */
app.get("/items", (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    res.json(rows);
  });
});

/* GET SELLERS */
app.get("/sellers", (req, res) => {
  db.all("SELECT DISTINCT seller FROM items", (err, rows) => {
    res.json(rows);
  });
});

/* SEARCH */
app.get("/search/:q", (req, res) => {
  const q = `%${req.params.q}%`;
  db.all(
    "SELECT * FROM items WHERE name LIKE ? OR seller LIKE ? OR location LIKE ?",
    [q, q, q],
    (err, rows) => res.json(rows)
  );
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);