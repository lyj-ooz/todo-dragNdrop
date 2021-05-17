const container = document.querySelector(".container");
const todoInput = document.querySelector(".input input");
const todoCards = document.querySelector(".todo-cards");
const finishedCards = document.querySelector(".finished-cards");
const todoCardsSection = document.querySelector(".todo");
const finishedCardsSection = document.querySelector(".finished");
const cards = document.querySelectorAll("div[class$='-cards']");
const toggle = document.getElementById("toggle");

let todos;
let finished;

init();

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.className === "delete") {
      const currTargetClassName = e.currentTarget.className;
      const id = e.target.parentElement.dataset.id;
      let from = "";

      if (currTargetClassName === "todo-cards") {
        from = "todo";
      } else if (currTargetClassName === "finished-cards") {
        from = "finished";
      }
      removeFromLocal(id, from);
      e.target.parentElement.remove();
    }
  });
});

container.addEventListener("mousedown", () => {
  const cardDivs = document.querySelectorAll(
    ".todo-cards div, .finished-cards div"
  );

  cardDivs.forEach((cardDiv) => {
    cardDiv.addEventListener("dragstart", () => {
      cardDiv.classList.add("dragging");
    });
    cardDiv.addEventListener("dragend", () => {
      cardDiv.classList.remove("dragging");
    });
  });
});

finishedCardsSection.addEventListener("dragover", (e) => e.preventDefault());
finishedCardsSection.addEventListener("drop", (e) => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");
  finishedCards.appendChild(dragging);
  const draggingText = dragging.innerText;
  const data = {
    id: dragging.dataset.id,
    val: draggingText.substring(0, draggingText.length - 2),
  };
  saveToLocal(data, "finished");
  removeFromLocal(dragging.dataset.id, "todo");
});

todoCardsSection.addEventListener("dragover", (e) => e.preventDefault());
todoCardsSection.addEventListener("drop", (e) => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");
  todoCards.appendChild(dragging);
  const draggingText = dragging.innerText;
  const data = {
    id: dragging.dataset.id,
    val: draggingText.substring(0, draggingText.length - 2),
  };
  saveToLocal(data, "todo");
  removeFromLocal(dragging.dataset.id, "finished");
});

document.querySelector(".input form").addEventListener("submit", (e) => {
  e.preventDefault();
});

todoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const inputVal = todoInput.value;

    if (inputVal.trim() === "") return;

    const todoID = Date.now().toString();
    const todoData = {
      id: todoID,
      val: inputVal,
    };
    addTodoToCards(inputVal, todoID);
    saveToLocal(todoData, "todo");
    todoInput.value = "";
  }
  e.preventDefault();
});

// clear input field when lose focus
todoInput.addEventListener("focusout", () => {
  todoInput.value = "";
});

//toggle for dark/light mode
toggle.addEventListener("click", setDarkMode);

//------------//
// functions
//------------//
function init() {
  if (localStorage.getItem("todo")) {
    const todoFromLocal = JSON.parse(localStorage.getItem("todo"));
    todoFromLocal.forEach((todo) => {
      addTodoToCards(todo.val, todo.id);
    });
  }

  if (localStorage.getItem("finished")) {
    const finishedFromLocal = JSON.parse(localStorage.getItem("finished"));
    finishedFromLocal.forEach((finished) => {
      addTodoToCards(finished.val, finished.id, "finished");
    });
  }

  if (localStorage.getItem("dark")) {
    const dark = JSON.parse(localStorage.getItem("dark"));
    if (dark) {
      toggle.classList.add("active");
      document.body.classList.add("dark");
    }
  }
}

function addTodoToCards(txt, id, to = "") {
  //1. make todo div
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("draggable", true);
  todoDiv.dataset.id = id;
  todoDiv.innerText = txt;
  // 1-1. make button for delete
  const delButton = document.createElement("button");
  delButton.className = "delete";
  delButton.innerText = "X";
  todoDiv.appendChild(delButton);
  //2. add it to todo-cards
  // if it is for 'finished', add to fnished-cards
  if (to === "finished") {
    finishedCards.appendChild(todoDiv);
  } else {
    todoCards.appendChild(todoDiv);
  }
  //3. make it twinkle for 0.3s
  twinkle(todoDiv);
}

function twinkle(elem) {
  elem.classList.add("twinkle");
  setTimeout(() => {
    elem.classList.remove("twinkle");
  }, 300);
}

function saveToLocal(val, tag) {
  if (tag === "todo") {
    if (localStorage.getItem("todo")) {
      todos = JSON.parse(localStorage.getItem("todo"));
    } else {
      todos = [];
    }
    todos.push(val);
    localStorage.setItem("todo", JSON.stringify(todos));
  } else if (tag === "finished") {
    if (localStorage.getItem("finished")) {
      finished = JSON.parse(localStorage.getItem("finished"));
    } else {
      finished = [];
    }
    finished.push(val);
    localStorage.setItem("finished", JSON.stringify(finished));
  } else {
    localStorage.setItem("dark", JSON.stringify(val));
  }
}

function removeFromLocal(id, from) {
  if (from === "todo") {
    // remove from 'todo'
    const todos = JSON.parse(localStorage.getItem("todo"));
    const idx = todos.findIndex((todo) => {
      return todo.id === id;
    });
    todos.splice(idx, 1);
    localStorage.setItem("todo", JSON.stringify(todos));
  } else {
    // remove from 'finished'
    const finished = JSON.parse(localStorage.getItem("finished"));
    const idx = finished.findIndex((f) => {
      return f.id === id;
    });
    finished.splice(idx, 1);
    localStorage.setItem("finished", JSON.stringify(finished));
  }
}

function setDarkMode() {
  let dark;
  if (
    toggle.classList.contains("active") &&
    document.body.classList.contains("dark")
  ) {
    toggle.classList.remove("active");
    document.body.classList.remove("dark");
    dark = false;
  } else {
    toggle.classList.add("active");
    document.body.classList.add("dark");
    dark = true;
  }

  saveToLocal(dark, "dark");
}
