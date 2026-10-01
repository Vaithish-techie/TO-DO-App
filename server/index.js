const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); // basically used to get data in req.body as json

//Routes
//create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description],
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todo
app.get("/todos", async (req, res) => {
  try {
    const alltodos = await pool.query("SELECT * FROM todo");
    res.json(alltodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a specific todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todoid = await pool.query("SELECT * from todo where todo_id=$1", [id]);
  res.json(todoid.rows[0]);
});

//update a query
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatetodo = await pool.query(
      "Update todo set description=$1 where id =$2",
      [description, id],
    );
    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a query
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deltodo = await pool.query("Delete from todo where todo_id =$1", [
      id,
    ]);
    res.json("Todo was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server running in 5000");
});
