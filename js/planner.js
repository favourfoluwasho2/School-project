// ── Academic Planner ──
let tasks = JSON.parse(localStorage.getItem('ff_tasks') || '[]');
let currentFilter = 'all';

function saveTasks() { localStorage.setItem('ff_tasks', JSON.stringify(tasks)); }

function renderTasks() {
  const list = document.getElementById('taskList');
  if (!list) return;

  let filtered = tasks;
  if (currentFilter === 'active')    filtered = tasks.filter(t => !t.done);
  if (currentFilter === 'completed') filtered = tasks.filter(t =>  t.done);

  // Stats
  document.getElementById('statTotal').textContent     = tasks.length;
  document.getElementById('statDone').textContent      = tasks.filter(t => t.done).length;
  document.getElementById('statPending').textContent   = tasks.filter(t => !t.done).length;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="planner-empty"><div class="empty-icon">📋</div><p>No tasks here yet. Add one to get started!</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <div class="task-item ${t.done ? 'completed' : ''}" data-id="${t.id}">
      <div class="task-check ${t.done ? 'checked' : ''}" onclick="toggleTask(${t.id})" title="Mark complete"></div>
      <div class="task-info">
        <div class="task-text">${escHtml(t.text)}</div>
        <div class="task-meta">
          <span class="task-priority priority-${t.priority}">${t.priority}</span>
          <span>${t.category}</span>
          ${t.due ? `<span>Due: ${t.due}</span>` : ''}
        </div>
      </div>
      <button class="task-delete" onclick="deleteTask(${t.id})" title="Delete task">✕</button>
    </div>
  `).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTasks(); renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); renderTasks();
  showToast('Task deleted', 'error');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  // Add task form
  const form = document.getElementById('addTaskForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = document.getElementById('taskText').value.trim();
      if (!text) return;
      const task = {
        id:       Date.now(),
        text,
        priority: document.getElementById('taskPriority').value,
        category: document.getElementById('taskCategory').value,
        due:      document.getElementById('taskDue').value,
        done:     false,
      };
      tasks.unshift(task);
      saveTasks(); renderTasks();
      form.reset();
      showToast('Task added!');
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });

  // Clear completed
  const clearBtn = document.getElementById('clearCompleted');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const count = tasks.filter(t => t.done).length;
      tasks = tasks.filter(t => !t.done);
      saveTasks(); renderTasks();
      if (count) showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`);
    });
  }
});
