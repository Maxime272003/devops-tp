const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongodb:27017/tododb";
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB avec retry logic
const connectWithRetry = () => {
  console.log("Tentative de connexion à MongoDB...");
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Connecté à MongoDB avec succès");
    })
    .catch((err) => {
      console.error("❌ Erreur de connexion à MongoDB:", err.message);
      console.log("⏳ Nouvelle tentative dans 5 secondes...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Routes
const todoRoutes = require("./routes/todos");

// Health check
app.get("/api/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };
  res.status(200).json(healthcheck);
});

// Routes Todo
app.use("/api/todos", todoRoutes);

// Route par défaut
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Todo List",
    endpoints: {
      health: "/api/health",
      todos: "/api/todos",
    },
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Démarrer le serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 API accessible sur http://localhost:${PORT}`);
});

// Gestion de l'arrêt gracieux
process.on("SIGTERM", () => {
  console.log("SIGTERM reçu, arrêt du serveur...");
  mongoose.connection.close(() => {
    console.log("Connexion MongoDB fermée");
    process.exit(0);
  });
});
