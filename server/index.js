const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("homepage"));

// let path = ":memory:";
let path = "C:/Users/Joeyt/Desktop/react-stuff/demo/users.db";
let db = new sqlite3.Database(path, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");
});

app.post("/register", (req, res) => {
  const user = req.body;
  //open the database
  db.serialize(function () {
    //db.run to create my database
    let table = db.run(
      "CREATE TABLE IF NOT EXISTS users (name TEXT, age INT, email TEXT)"
    );
    //insert values for my database
    let data = table.prepare("INSERT INTO users VALUES (?, ?, ?)");
    data.run(user.name, user.age, user.email);
    //save database
    data.finalize();
  });
  console.log(req.body);
  res.json(req.body);
});

app.post("/login", (req, res) => {
  db.serialize(function () {
    const name = req.body.name;
    const email = req.body.email;
    db.get(
      "Select * FROM users WHERE name = ? AND email = ?",
      [name, email],
      function (err, row) {
        if (err) {
          console.log(err.message);
        }
        if (row) {
          console.log(row.name, row.email);
          res.json(row);
        } else {
          res.send({ message: "Wrong name/email combination" });
        }
      }
    );
  });
  // res.json(req.body);
});

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
