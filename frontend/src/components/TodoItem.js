import React from "react";

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
          className="todo-checkbox"
        />
        <div className="todo-text">
          <h3 className={todo.completed ? "line-through" : ""}>{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <small className="todo-date">
            Créé le: {new Date(todo.createdAt).toLocaleDateString("fr-FR")}
          </small>
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => onEdit(todo)}
          className="btn btn-edit"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          className="btn btn-delete"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
