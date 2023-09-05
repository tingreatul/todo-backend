const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://atultingre:atultingre@cluster0.g19ozv0.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

// Check for database connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a Todo schema and model using Mongoose
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const validateTodo = (req, res, next) => {
  const { task, completed } = req.body;
  if (!task || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  next();
};

// CREATE TODO
app.post("/todos", validateTodo, async (req, res) => {
  try {
    const { task, completed } = req.body;
    const todo = new Todo({
      task,
      completed,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET TODOS BY ID
app.get("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    if (!todo)
      return res
        .status(404)
        .json({ error: "The todo with given ID was not found." });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE TODO
app.put("/todos/:id", validateTodo, async (req, res) => {
  try {
    const id = req.params.id;
    const { task, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { task, completed },
      { new: true }
    );
    if (!todo)
      return res
        .status(404)
        .json({ error: "The todo with given ID was not found." });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByIdAndRemove(id);
    if (!todo)
      return res
        .status(404)
        .json({ error: "The todo with given ID was not found." });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Server is listening on ${port}`));