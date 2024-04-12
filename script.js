const container = document.querySelector('.task-tracker__wrapper');
const form = document.querySelector('.task-tracker__form');
const list = document.querySelector('.task-tracker__list');
const field = document.querySelector('.task-tracker__field');
const fieldDeleteButton = field.parentElement.querySelector('.task-tracker__delete');
let editingTask = null;

let containerMinHeight = container.offsetHeight;
setContainerHeight();

let tasks = [
  {
    id: 'task-1',
    text: 'Выгулять собаку',
    completed: false,
  },
  {
    id: 'task-2',
    text: 'Дочитать книгу',
    completed: false,
  },
  {
    id: 'task-3',
    text: 'Отправить письмо маме',
    completed: false,
  },
  {
    id: 'task-4',
    text: 'Сделать зарядку',
    completed: true,
  },
  {
    id: 'task-5',
    text: 'Позвонить риелтору',
    completed: false,
  },
];

checkEmptyList();

function checkEmptyList() {
  container.classList.toggle('task-tracker__wrapper--completed', list.children.length === 0);
};

function setContainerHeight() {
  containerMinHeight = container.offsetHeight;
  container.style.setProperty('--container-height', containerMinHeight + 'px');
}

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
} else {
  tasks.forEach((task) => renderTask(task));
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

saveToLocalStorage();

function renderTask(task) {
  const taskHTML = `
    <li class="task-tracker__item">
      <input class="task-tracker__checkbox" type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
      <label class="task-tracker__label" for="${task.id}">${task.text}</label>
      <button class="task-tracker__edit task-tracker__action-button" type="button">
        <span class="visually-hidden">Редактировать.</span>
      </button>
      <button class="task-tracker__delete task-tracker__action-button" type="reset">
        <span class="visually-hidden">Удалить задачу.</span>
      </button>
    </li>`;

  list.insertAdjacentHTML('beforeend', taskHTML);
  setContainerHeight();
  checkEmptyList();
};

function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  renderTask(newTask);
  saveToLocalStorage();
};

function onFormSubmit(event) {
  event.preventDefault();

  if (field.classList.contains('task-tracker__field--hide')) {
    field.classList.remove('task-tracker__field--hide');
  } else if (field.value !== '') {
    if (editingTask) {
      const label = editingTask.querySelector('.task-tracker__label');
      label.textContent = field.value;
      label.parentElement.querySelector('.task-tracker__edit').focus();
      updateTask(editingTask);
      editingTask = null;
    } else {
      addTask(field.value);
      container.classList.remove('task-tracker__wrapper--completed');
    }
  }

  field.value = '';
};

function onFieldDeleteButtonClick() {
  if (field.value === '') {
    field.classList.add('task-tracker__field--hide');
  } else {
    field.value = '';
  }
};

function deleteTask(task) {
  const id = task.querySelector('.task-tracker__checkbox').id;
  tasks = tasks.filter((task) => String(task.id) !== id);
  task.remove();
  saveToLocalStorage();
};

function updateTask(task) {
  const id = task.querySelector('.task-tracker__checkbox').id;
  editingText = task.querySelector('.task-tracker__label').textContent;

  tasks.forEach((task) => {
    if (String(task.id) === id) {
      task.text = editingText;
    }
  });

  saveToLocalStorage();
};

list.querySelectorAll('.task-tracker__item').forEach((item) => {
  toggleEditDisabled(item);
});

function toggleEditDisabled(task) {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const editButton = task.querySelector('.task-tracker__edit');

  editButton.toggleAttribute('disabled', checkbox.checked);
};

function toggleTaskChecked(task) {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const checkboxChecked = checkbox.checked;

  tasks.forEach((task) => {
    if (String(task.id) === checkbox.id) {
      task.completed = checkboxChecked;
    }
  });

  saveToLocalStorage();
}

function onListClick(event) {
  if (event.target.classList.contains('task-tracker__delete')) {
    const task = event.target.parentElement;
    deleteTask(task);

    if (list.children.length === 0) {
      container.classList.add('task-tracker__wrapper--completed');
      confetti({
        colors: ['#1b1b1b', '#ececec', '#ffffff', '#e12b56',],
        shapes: ['star'],
        disableForReducedMotion: true,
      });
    }
  }

  if (event.target.classList.contains('task-tracker__edit')) {
    const task = event.target.parentElement;
    const label = task.querySelector('.task-tracker__label')
    field.value = label.textContent;
    field.classList.remove('task-tracker__field--hide');
    field.focus();
    editingTask = task;
  }

  if (event.target.classList.contains('task-tracker__checkbox')) {
    const task = event.target.parentElement;
    toggleEditDisabled(task);
    toggleTaskChecked(task);
  }
};

list.addEventListener('click', onListClick);
form.addEventListener('submit', onFormSubmit);
fieldDeleteButton.addEventListener('click', onFieldDeleteButtonClick);
