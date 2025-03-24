const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// 1. Connect to MongoDB
//    Provide your connection string in an environment variable, e.g. MONGO_URI="mongodb://user:pass@<MongoHost>:27017/todosDB"
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 2. Define a Mongoose schema + model
const todoSchema = new mongoose.Schema({
  text: String,
  // You can add fields like "completed: Boolean" as needed
});

const Todo = mongoose.model("Todo", todoSchema);

// 3. Routes

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a todo by ID
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end(); // No content on success
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Todo backend listening on port ${port}`);
});
