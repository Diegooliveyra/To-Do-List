const todoForm = document.querySelector(".to-do-form");
const todoList = document.querySelector(".to-do-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

// submit form
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = this.name;
  const inputValue = input.value;

  if (inputValue != "") {
    const task = {
      id: new Date().getTime(),
      name: inputValue,
      isCompleted: false,
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(task);
    todoForm.reset();
  }
  input.focus();
});

// remove task
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }
});

// update task - change status or name
todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTask(taskId, e.target);
});

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}

// create task
function createTask(task) {
  const taskEl = document.createElement("li");
  taskEl.setAttribute("id", task.id);
  const taskElMarkup = `
  <div class="wrapper">
    <input type="checkbox" id="${task.name}-${task.id}" name="tasks"  ${
    task.isCompleted ? "checked" : ""
  } class="check" >
    <label for="${task.name}-${task.id}"></label>
    <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    <button class="remove-task" title="Remove ${
      task.name
    } task"><i class="far fa-trash-alt"></i></button>
  </div>
  `;
  taskEl.innerHTML = taskElMarkup;
  todoList.appendChild(taskEl);
}

// update task
function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contentEditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling.nextElementSibling;
    task.isCompleted = !task.isCompleted;
    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      el.setAttribute("checked", "");
    } else {
      el.removeAttribute("checked");
      span.setAttribute("contenteditable", "");
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  countTasks();
}
