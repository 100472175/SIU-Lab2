// Fetch from a json to an array of tasks
const taskList = [];

// Read from the json(tasks.json) and add to the array

const loadTasks = () => {
  fetch("/tasks/get");
};

const add = () => {
  const tak_name = document.querySelector("#task-name").value;
  document.querySelector("#task-name").value = "";
  const task = {
    id: taskList.length + 1,
    title: tak_name,
    done: true,
  };
  taskList.push(task);
  console.log(taskList);
  render();
};

const remove = () => {
  console.log("Remove task");
  taskList.pop();
  render();
};

const toggleDone = () => {};

const render = () => {
  const taskListElement = document.querySelector("#task-list");
  taskListElement.innerHTML = "";
  taskList.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.textContent = task.title;
    // If the element has index even, add the class done_class, otherwise add the class not_done_class
    taskElement.className = task.id % 2 === 0 ? "done-class" : "not-done-class";
    taskElement.classList.add("element-task-list");
    //taskElement.className = task.done ? "done_class" : "not_done_class";
    taskListElement.appendChild(taskElement);
  });
};

const clear = () => {
  console.log("Clear tasks");
  taskList.length = 0;
  render();
};

const addButton = document.querySelector("#fab-add");
const clearButton = document.querySelector("#fab-clear");

addButton.addEventListener("touchend", add);
addButton.addEventListener("click", add);

clearButton.addEventListener("touchend", clear);
clearButton.addEventListener("click", clear);

// To remove a task, iw ant to swire right on the task
// To mark a task as done, I want to maintain the task for 2 seconds
// To mark a task as not done, I want to do hold the task for 2 seconds

const swipeList = document.getElementsByClassName("element-task-list");
let startX = 0;
let startY = 0;

swipeList.addEventListener("touchstart", function (event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

swipeList.addEventListener("touchmove", function (event) {
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const diffX = currentX - startX;
  const diffY = currentY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    event.preventDefault(); // Prevent vertical scrolling while swiping horizontally
  }
});

swipeList.addEventListener("touchend", function (event) {
  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 2000) {
      console.log("Swiped right");
      // Perform your action for swiping right here
    }
  }
});
