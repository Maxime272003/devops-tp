import React, { useState, useEffect } from "react";

const TodoForm = ({ onSubmit, editingTodo, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || "");
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description });
      setTitle("");
      setDescription("");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Titre de la tâche *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          rows="3"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTodo ? "Mettre à jour" : "Ajouter"}
        </button>
        {editingTodo && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
