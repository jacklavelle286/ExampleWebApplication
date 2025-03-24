// todo.js
document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
  
    // For demonstration, store to-dos in local storage.
    // In a real app, you'd fetch and persist these to your backend / MongoDB.
    let todos = [];
  
    // Load existing to-dos from local storage (or from your backend API).
    function loadTodos() {
      try {
        const storedTodos = localStorage.getItem("myTodos");
        todos = storedTodos ? JSON.parse(storedTodos) : [];
        renderTodos();
      } catch (error) {
        console.error("Error loading todos:", error);
        todos = [];
      }
    }
  
    // Save to-dos to local storage (replace with an API call in a real app).
    function saveTodos() {
      localStorage.setItem("myTodos", JSON.stringify(todos));
    }
  
    // Render the list of to-dos to the DOM.
    function renderTodos() {
      todoList.innerHTML = ""; // Clear existing list
      todos.forEach((todo, index) => {
        // Create a list item
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.textContent = todo.text;
  
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
        deleteBtn.addEventListener("click", () => {
          deleteTodo(index);
        });
  
        // Append delete button to list item
        li.appendChild(deleteBtn);
        // Append list item to the UL
        todoList.appendChild(li);
      });
    }
  
    // Add a new to-do item
    function addTodo(text) {
      todos.push({ text });
      saveTodos();
      renderTodos();
    }
  
    // Delete a to-do by index
    function deleteTodo(index) {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    }
  
    // Handle form submission
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (text !== "") {
        addTodo(text);
        todoInput.value = "";
      }
    });
  
    // Initial load
    loadTodos();
  });
  