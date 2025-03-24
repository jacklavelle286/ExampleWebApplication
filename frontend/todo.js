document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const loadingSpinner = document.getElementById("loading-spinner");
  const errorMessage = document.getElementById("error-message");

  // Replace this with your actual backend endpoint
  const API_URL = "http://YOUR-BACKEND-DNS:3000/api/todos";

  let todos = [];

  // Show/Hide Spinner
  function showSpinner() {
    loadingSpinner.style.display = "inline-block";
  }
  function hideSpinner() {
    loadingSpinner.style.display = "none";
  }

  // Show error message
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = "block";
  }
  // Hide error message
  function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  // ----------------------------------
  // Fetch existing to-dos from backend
  // ----------------------------------
  async function loadTodos() {
    showSpinner();
    hideError();

    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      todos = await res.json(); // an array of { _id, text }
      renderTodos();
    } catch (error) {
      console.error("Error loading todos:", error);
      showError("Unable to load your to-dos. Please try again later.");
      todos = []; // fallback to empty
    } finally {
      hideSpinner();
    }
  }

  // ----------------------------------
  // Add a new to-do via the backend
  // ----------------------------------
  async function addTodo(text) {
    showSpinner();
    hideError();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const newTodo = await res.json();
      todos.push(newTodo);
      renderTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      showError("Unable to add a new to-do. Please try again.");
    } finally {
      hideSpinner();
    }
  }

  // ----------------------------------
  // Delete a to-do from the backend
  // ----------------------------------
  async function deleteTodo(id) {
    showSpinner();
    hideError();

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      // Filter out the deleted item from local list
      todos = todos.filter((todo) => todo._id !== id);
      renderTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      showError("Unable to delete this to-do. Please try again.");
    } finally {
      hideSpinner();
    }
  }

  // ----------------------------------
  // Render the list of to-dos to the DOM
  // ----------------------------------
  function renderTodos() {
    todoList.innerHTML = ""; // Clear existing list
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      li.textContent = todo.text;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
      deleteBtn.addEventListener("click", () => {
        deleteTodo(todo._id);
      });

      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  // ----------------------------------
  // Handle form submission
  // ----------------------------------
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text !== "") {
      addTodo(text);
      todoInput.value = "";
    }
  });

  // Initial load of to-dos
  loadTodos();
});
