import axios from "axios";

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Intercepteur pour la gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erreur API:", error.response.data);
    } else if (error.request) {
      console.error("Pas de réponse du serveur");
    } else {
      console.error("Erreur:", error.message);
    }
    return Promise.reject(error);
  }
);

// Service Todo
export const todoService = {
  // Récupérer toutes les tâches
  getAllTodos: async () => {
    try {
      const response = await api.get("/todos");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une tâche par ID
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer une nouvelle tâche
  createTodo: async (todoData) => {
    try {
      const response = await api.post("/todos", todoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une tâche
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une tâche
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier l'état de l'API
  checkHealth: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
