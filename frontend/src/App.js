import React, { useState, useEffect } from "react";
import { todoService } from "./services/api";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [apiStatus, setApiStatus] = useState("unknown");

  // Charger les tâches au démarrage
  useEffect(() => {
    loadTodos();
    checkApiHealth();
  }, []);

  // Vérifier la santé de l'API
  const checkApiHealth = async () => {
    try {
      await todoService.checkHealth();
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("disconnected");
    }
  };

  // Charger toutes les tâches
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getAllTodos();
      setTodos(response.data || []);
      setApiStatus("connected");
    } catch (error) {
      setError("Impossible de charger les tâches. Vérifiez votre connexion.");
      setApiStatus("disconnected");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Créer ou mettre à jour une tâche
  const handleSubmit = async (todoData) => {
    try {
      if (editingTodo) {
        const response = await todoService.updateTodo(
          editingTodo._id,
          todoData
        );
        setTodos(
          todos.map((todo) =>
            todo._id === editingTodo._id ? response.data : todo
          )
        );
        setEditingTodo(null);
      } else {
        const response = await todoService.createTodo(todoData);
        setTodos([response.data, ...todos]);
      }
      setError(null);
    } catch (error) {
      setError("Erreur lors de la sauvegarde de la tâche");
      console.error("Erreur:", error);
    }
  };

  // Basculer l'état d'une tâche
  const handleToggle = async (id, completed) => {
    try {
      const response = await todoService.updateTodo(id, { completed });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      setError("Erreur lors de la mise à jour de la tâche");
      console.error("Erreur:", error);
    }
  };

  // Supprimer une tâche
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await todoService.deleteTodo(id);
        setTodos(todos.filter((todo) => todo._id !== id));
      } catch (error) {
        setError("Erreur lors de la suppression de la tâche");
        console.error("Erreur:", error);
      }
    }
  };

  // Éditer une tâche
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // Statistiques
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Todo List App</h1>
          <div className="api-status">
            <span
              className={`status-indicator ${apiStatus}`}
              title={`API ${
                apiStatus === "connected" ? "connectée" : "déconnectée"
              }`}
            >
              <span className={`status-dot ${apiStatus}`}></span>
              {apiStatus === "connected" ? "Connecté" : "Déconnecté"}
            </span>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-close">
              ×
            </button>
          </div>
        )}

        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">En cours</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Terminées</span>
          </div>
        </div>

        <div className="card">
          <h2>{editingTodo ? "Modifier la tâche" : "Nouvelle tâche"}</h2>
          <TodoForm
            onSubmit={handleSubmit}
            editingTodo={editingTodo}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Toutes ({stats.total})
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            En cours ({stats.active})
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Terminées ({stats.completed})
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            filter={filter}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Todo List App - DevOps TP</p>
      </footer>
    </div>
  );
}

export default App;
