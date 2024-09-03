document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const todoList = document.getElementById('todo-list');

  const fetchTodos = async () => {
    const res = await fetch('/todos');
    const todos = await res.json();
    todoList.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo.task;
      if (todo.completed) li.style.textDecoration = 'line-through';
      const completeBtn = document.createElement('button');
      completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
      completeBtn.addEventListener('click', async () => {
        await fetch(`/todos/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: todo.task, completed: !todo.completed })
        });
        fetchTodos();
      });
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        await fetch(`/todos/${todo.id}`, { method: 'DELETE' });
        fetchTodos();
      });
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  };

  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = taskInput.value;
    await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    taskInput.value = '';
    fetchTodos();
  });

  fetchTodos();
});
