import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Anand@2001", 
  database: "employeeDB",
});

db.connect((err) => {
  if (err) console.log(" DB Connection Error:", err);
  else console.log(" MySQL Connected!");
});
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

app.post("/employees", (req, res) => {
  const { name, employeeId, department, designation, project, type, status, photo } = req.body;

  const sql =
    "INSERT INTO employees (name, employeeId, department, designation, project, type, status, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [name, employeeId, department, designation, project, type, status, photo], (err, result) => {
    if (err) {
      console.error(" Error inserting data:", err);
      return res.status(500).send("Database error");
    }
    console.log(" Employee added:", result.insertId);
    res.send("Employee added successfully");
  });
});


app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, employeeId, department, designation, project, type, status, photo } = req.body;

  const sql =
    "UPDATE employees SET name=?, employeeId=?, department=?, designation=?, project=?, type=?, status=?, photo=? WHERE id=?";
  db.query(
    sql,
    [name, employeeId, department, designation, project, type, status, photo, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Employee updated successfully" });
    }
  );
});


app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Employee deleted successfully" });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
