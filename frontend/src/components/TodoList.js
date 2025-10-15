import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggle, onDelete, onEdit, filter }) => {
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>
          {filter === "active"
            ? "Aucune tâche en cours"
            : filter === "completed"
            ? "Aucune tâche terminée"
            : "Aucune tâche pour le moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;
