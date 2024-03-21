// Fetch from a json to an array of tasks
const taskList = [];

// Read from the json(tasks.json) and add to the array

const loadTasksBase = () => {
  taskList.length = 0;
  fetch("/tasksBase/get")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((task) => {
        taskList.push(task);
      });
      render();
      saveTasks();
    });
};

const loadTasks = () => {
  fetch("/tasks/get")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((task) => {
        taskList.push(task);
      });
      render();
    });
};

const saveTasks = () => {
  fetch("/tasks/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskList),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message); // This will log the response message
    });
};

const add = () => {
  const tak_name = document.querySelector("#task-name").value;
  document.querySelector("#task-name").value = "";
  if (tak_name === "") {
    alert("You have to input a task name");
    vibrate([200, 100, 200]);
    return;
  }
  const task = {
    id: taskList.length + 1,
    title: tak_name,
    done: false,
  };
  taskList.push(task);
  render();
  vibrate([200]);
  // Save the task to the json file
  saveTasks();
};

const remove = (index) => {
  console.log("Remove task");
  taskList.splice(index, 1);
  render();
  saveTasks();
};

const toggleDone = (task) => {
  task.done = !task.done;
  render();
  saveTasks();
};

const render = () => {
  const taskListElement = document.querySelector("#task-list");
  taskListElement.innerHTML = "";
  taskList.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.textContent = task.title;
    // If the element has index even, add the class done_class, otherwise add the class not_done_class
    taskElement.className = task.done ? "done-class" : "not-done-class";
    taskElement.classList.add("element-task-list");

    // ------------------- Hold -------------------
    // Add the two seconds hold event to mark the task as done
    taskElement.addEventListener("touchstart", function (event) {
      holdTimer = setTimeout(function () {
        toggleDone(task);
      }, 2000); // 2000 milliseconds = 2 seconds
    });

    taskElement.addEventListener("touchmove", function (event) {
      clearTimeout(holdTimer);
    });

    taskElement.addEventListener("touchend", function (event) {
      clearTimeout(holdTimer);
    });

    // ------------------- Swipe -------------------
    taskElement.addEventListener("touchstart", function (event) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    });

    taskElement.addEventListener("touchmove", function (event) {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        event.preventDefault(); // Prevent vertical scrolling while swiping horizontally
      }
    });

    taskElement.addEventListener("touchend", function (event) {
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 200) {
          remove(taskList.indexOf(task));
        }
      }
    });

    //taskElement.className = task.done ? "done_class" : "not_done_class";
    taskListElement.appendChild(taskElement);
  });
};

// Limia la lista de tareas, eliminando todos los elementos de la lista de tareas
const clear = () => {
  console.log("Clear tasks");
  taskList.length = 0;
  render();
  saveTasks();
};

const vibrate = (pattern) => {
  // Check if the Vibration API is supported
  if ("vibrate" in navigator) {
    // Vibrate for 200 milliseconds
    navigator.vibrate(pattern);
  } else {
    // Vibration API not supported
    console.log("Vibration API not supported");
  }
};

const addButton = document.querySelector("#fab-add");
const clearButton = document.querySelector("#fab-clear");

//addButton.addEventListener("touchend", add);
addButton.addEventListener("click", add);

// El mousedown está puesto para que funcione en ordenadores sin pantalla táctil
addButton.addEventListener("mousedown", function (event) {
  touchStartTime = Date.now();
  touchTimer = setTimeout(() => {
    console.log("Restored the task list to the original state");
    alert("Restored the task list to the original state");
    loadTasksBase();
    clearTimeout(touchTimer);
  }, 2000); // 2000 milliseconds = 2 seconds
});

// El mouseup resetea el contador de tiempo cuando se deja de tocar
addButton.addEventListener("mouseup", function (event) {
  clearTimeout(touchTimer);
});

// El touchstart está puesto para que funcione en dispositivos con pantalla táctil
addButton.addEventListener("touchstart", function (event) {
  touchStartTime = Date.now();
  touchTimer = setTimeout(() => {
    console.log("Restored the task list to the original state");
    alert("Restored the task list to the original state");
    loadTasksBase();
    clearTimeout(touchTimer);
  }, 2000); // 2000 milliseconds = 2 seconds
});

// El touch end resetea el contador de tiempo cuando se deja de tocar
addButton.addEventListener("touchend", function (event) {
  clearTimeout(touchTimer);
});

// Cuando se toca el botón de limiar la lista de tareas, se limpia la lista de tareas, tanto
// en dispositivos con pantalla táctil como en ordenadores
clearButton.addEventListener("touchend", clear);
clearButton.addEventListener("click", clear);

// Carga las tareas guardadas en el archivo tasks.json
loadTasks();

// Fix para el servidor que no muestra la etiqueta con id:add-task-container
const addTaskContainer = document.querySelector("#add-task-container");
addTaskContainer.style.removeProperty("display");
/*
// ------------------- Debugging -------------------
const debug = document.querySelector("#title");
// Repeat this every 200ms:

setInterval(() => {
  debug.textContent = taskList.length;
}, 200);

*/
// Loop through each element with the class name "element-task-list"
/*
for (let i = 0; i < swipeList.length; i++) {
  const element = swipeList[i];

  element.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  });

  element.addEventListener("touchmove", function (event) {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      event.preventDefault(); // Prevent vertical scrolling while swiping horizontally
    }
  });

  element.addEventListener("touchend", function (event) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 200) {
        // Adjust the threshold as needed
        console.log("Swiped right");
        alert("Swiped right");
        // Perform your action for swiping right here
      }
    }
  });
}
*/
