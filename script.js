const STORAGE_KEY = "tasks-app-state";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const countEl = document.getElementById("count");
const emptyMsg = document.getElementById("empty-msg");
const clearDoneBtn = document.getElementById("clear-done");

let tasks = loadTasks();

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("couldn't read saved tasks, starting fresh", err);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function render() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "mark task done");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.type = "button";
    delBtn.innerHTML = "&times;";
    delBtn.setAttribute("aria-label", "delete task");

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  updateCount();
}

function updateCount() {
  const left = tasks.filter((t) => !t.done).length;
  countEl.textContent = left === 1 ? "1 open item" : `${left} open items`;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.push({
    id: makeId(),
    text: trimmed,
    done: false,
  });

  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearFinished() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    deleteTask(id);
  } else if (e.target.classList.contains("check")) {
    toggleTask(id);
  }
});

clearDoneBtn.addEventListener("click", clearFinished);

render();