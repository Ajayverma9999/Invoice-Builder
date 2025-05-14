import React from 'react';


const TodoItem = ({ todo, onDelete }) => {
  return (
    <li>
      {todo.text}
      <button onClick={onDelete}>Delete</button>
    </li>
  );
};

export default TodoItem;


