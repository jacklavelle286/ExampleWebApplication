const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// 1. Connect to MongoDB
mongoose.connect("mongodb://admin:SomeSecurePasswordHere@10.0.3.50:27017/mydatabase?authSource=admin", {
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

app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Todo backend listening on port ${port}`);
});
