
//Получаем элементы для вставки новых задач
const taskList = document.querySelector(".tasks-list");
const taskForm = document.querySelector(".create-task-block");


//Массив объектов уже существующих задач
const tasks = [
  {
    id: "1138465078061",
    completed: false,
    text: "Посмотреть новый урок по JavaScript",
  },
  {
    id: "1138465078062",
    completed: false,
    text: "Выполнить тест после урока",
  },
  {
    id: "1138465078063",
    completed: false,
    text: "Выполнить ДЗ после урока",
  },
];


//Формируем новую задачу
const addNewTask = (text) => {
  const taskId = Date.now().toString();
  const task = {
    id: taskId,
    completed: false,
    text
  };

  tasks.push(task); //записываем задачу в массив
  taskList.append(createTaskItem(text, taskId)); //выводим новую задачу в список
};


//формируем HTML разметку под список задач
function createTaskItem(task, taskIds) {
  const taskItem = document.createElement("div");
  taskItem.dataset.taskId = taskIds;
  taskItem.className = "task-item";

  const mainContainer = document.createElement("div");
  mainContainer.className = "task-item__main-container";

  taskItem.append(mainContainer);

  const mainContent = document.createElement("div");
  mainContent.className = "task-item__main-content";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-item__delete-button default-button delete-button";
  deleteBtn.innerText = "Удалить";

  mainContainer.append(mainContent, deleteBtn);

  const formCheckbox = document.createElement("form");
  formCheckbox.className = "checkbox-form";

  const spanText = document.createElement("span");
  spanText.className = "task-item__text";
  spanText.innerText = task;

  mainContent.append(formCheckbox, spanText);

  const inputForm = document.createElement("input");
  inputForm.className = "checkbox-form__checkbox";
  inputForm.type = "checkbox";
  inputForm.id = taskIds;

  const labelForm = document.createElement("label");
  labelForm.htmlFor = taskIds;

  formCheckbox.append(inputForm, labelForm);

  return taskItem;
}


//выводим массив задач в созданную разметку
tasks.forEach((el) => {
  taskList.append(createTaskItem(el.text, el.id));
});


//создаем разметку для вывода ошибки
const createErrorMessage = (taskText) => {
  const errorMessage = document.createElement("span");
  errorMessage.className = "error-message-block";
  // если поле воода пустое
  if (!taskText) {
    errorMessage.remove();
    errorMessage.textContent = "Название задачи не должно быть пустым";
    taskForm.append(errorMessage);
    return errorMessage;
  } else {
    errorMessage.textContent = "Задача с таким названием уже существует"; // если поле не пустое
    taskForm.append(errorMessage);
    return errorMessage;
  }
};

//обработка ввода задачи - кнопка нажать или Enter
taskForm.addEventListener("submit", (event) => {
  const errorMessage = document.querySelector(".error-message-block");
  event.preventDefault();
  const { target } = event;
  const inputValue = target.taskName.value;
  if (errorMessage) {
    errorMessage.remove();
  }

  if (!inputValue) {
    createErrorMessage(inputValue);
  } else {
    let isTaskExist = tasks.find((el) => el.text === inputValue);
    if (isTaskExist) {
      createErrorMessage(inputValue);
    } else {
      addNewTask(inputValue);
    }
  }
});


//Разметка для модального окна
const createModal = document.createElement("div");
createModal.innerHTML =
  '<div class="modal-overlay modal-overlay_hidden"><div class="delete-modal"><h3 class="delete-modal__question">Вы действительно хотите удалить эту задачу?</h3><div class="delete-modal__buttons"><button class="delete-modal__button delete-modal__cancel-button">Отмена</button><button class="delete-modal__button delete-modal__confirm-button">Удалить</button></div></div></div>';
document.body.prepend(createModal);

const modalDelete = document.querySelector(".modal-overlay");

//Делегирование событий - один обработчик на все кнопки удалить
taskList.addEventListener("click", (event) => {
  const isButton = event.target.closest("button");
  const chosenTask = event.target.closest(".task-item");
  const dataTaskId = chosenTask.dataset.taskId; //получение Id выбранной задачи
  
  if (isButton) {
    modalDelete.classList.remove("modal-overlay_hidden"); //показываем модальное окно
    
    //обработка нажатия на кнопку отмена в модальном окне
    const modalButtonCancel = document.querySelector(".delete-modal__cancel-button");
       
    modalButtonCancel.addEventListener("click", () =>
      modalDelete.classList.add("modal-overlay_hidden"));
    
    //обработка нажатия на кнопку подтвердить в модальном окне
    const modalButtonConfirm = document.querySelector(".delete-modal__confirm-button");
    
    modalButtonConfirm.addEventListener("click", () => {
      let taskIndex = tasks.findIndex((el) => el.id === dataTaskId); //получения индекса задачи в массиве
      tasks.splice(taskIndex, 1); //удаление задачи из массива по индексу
      chosenTask.remove(); 
      modalDelete.classList.add("modal-overlay_hidden"); //скрываем модальное окно
    });
  }
});


//Смена светлой и темной темы по нажатию на Tab
const taskItems = document.querySelectorAll(".task-item");
const allButtons = document.querySelectorAll("button");
let isTheme = 0;

const keyTab = document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    if (isTheme === 1) {
      setThemeLight();
    } else {
      setThemeDark();
    }
  }
});

const setThemeDark = () => {
  document.body.style = "background: #24292E";
  taskItems.forEach((el) => (el.style = "color: #ffffff"));
  allButtons.forEach((el) => (el.style = "border: 1px solid #ffffff"));
  return (isTheme = 1);
};

const setThemeLight = () => {
  document.body.style = "background: initial";
  taskItems.forEach((el) => (el.style = "color: initial"));
  allButtons.forEach((el) => (el.style = "border: none"));
  return (isTheme = 0);
};
