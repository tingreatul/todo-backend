const express = require("express");
const app = express();
app.use(express.json());

const validateTodo = (req, res, next) => {
  const { task, completed } = req.body;
  if (!task || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  next();
};

// CREATE TODO
app.post("/todos", validateTodo, (req, res) => {
  const todo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: req.body.completed,
  };
  todos.push(todo);
  res.send(todo);
});

// READ ALL TODOS
app.get("/", (req, res) => {
  res.json(todos);
});

// GET TODOS BY ID
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo)
    return res.status(404).send("The todo with given ID was not found.");
  res.json(todo);
});

// UPDATE TODO
app.put("/todos/:id", validateTodo, (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo)
    return res.status(404).send("The todo with given ID was not found.");

  todo.task = req.body.task;
  todo.completed = req.body.completed;

  res.json(todo);
});

// DELETE TODO
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo)
    return res.status(404).send("The todo with given ID was not found.");

  const index = todos.indexOf(todo);
  todos.splice(index, 1);

  res.json(todo);
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Server is listening on ${port}`));

const todos = [
  {
    id: 1,
    task: "Buy groceries",
    completed: false,
  },
  {
    id: 2,
    task: "Finish homework",
    completed: true,
  },
  {
    id: 3,
    task: "Go for a run",
    completed: false,
  },
  {
    id: 4,
    task: "Read a book",
    completed: false,
  },
  {
    id: 5,
    task: "Call a friend",
    completed: true,
  },
  {
    id: 6,
    task: "Clean the house",
    completed: false,
  },
  {
    id: 7,
    task: "Write a report",
    completed: false,
  },
  {
    id: 8,
    task: "Plan a trip",
    completed: true,
  },
  {
    id: 9,
    task: "Learn JavaScript",
    completed: false,
  },
  {
    id: 10,
    task: "Watch a movie",
    completed: true,
  },
];
