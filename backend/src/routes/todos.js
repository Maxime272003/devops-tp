const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET - Récupérer toutes les tâches
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des tâches",
      message: error.message,
    });
  }
});

// GET - Récupérer une tâche par ID
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la tâche",
      message: error.message,
    });
  }
});

// POST - Créer une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Le titre est obligatoire",
      });
    }

    const todo = new Todo({
      title,
      description: description || "",
    });

    const savedTodo = await todo.save();

    res.status(201).json({
      success: true,
      message: "Tâche créée avec succès",
      data: savedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Erreur lors de la création de la tâche",
      message: error.message,
    });
  }
});

// PUT - Mettre à jour une tâche
router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    updateData.updatedAt = Date.now();

    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Tâche mise à jour avec succès",
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Erreur lors de la mise à jour de la tâche",
      message: error.message,
    });
  }
});

// DELETE - Supprimer une tâche
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Tâche supprimée avec succès",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de la tâche",
      message: error.message,
    });
  }
});

module.exports = router;
