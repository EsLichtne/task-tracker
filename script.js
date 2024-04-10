const container = document.querySelector('.task-tracker__wrapper');
const list = document.querySelector('.task-tracker__list');
const field = document.querySelector('.task-tracker__field');
const addButton = document.querySelector('.task-tracker__add-button');
const fieldDeleteButton = field.parentElement.querySelector('.task-tracker__delete');
let editingTask = null;

let tasks = [];

const createTaskObject = (task) => {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const label = task.querySelector('.task-tracker__label');

  const taskObject = {
    id: checkbox.id,
    text: label.textContent,
    checked: checkbox.checked,
  };

  tasks.push(taskObject);
};

const deleteTaskObject = (task) => {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const id = checkbox.id;

  tasks = tasks.filter((task) => task.id !== id);
};

const toggleTaskChecked = (task) => {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const checkboxChecked = checkbox.checked;

  tasks.forEach((task) => {
    if (task.id === checkbox.id) {
      task.checked = checkboxChecked;
    }
  });
}

let containerMinHeight = container.offsetHeight;
container.style.setProperty('--container-height', containerMinHeight + 'px');

const createTask = (taskText) => {
  const task = document.createElement('li');
  task.classList.add('task-tracker__item');
  task.innerHTML =
    `
    <input class="task-tracker__checkbox" type="checkbox" id="task-${list.children.length + 1}">
    <label class="task-tracker__label" for="task-${list.children.length + 1}">${taskText}</label>
    <button class="task-tracker__edit task-tracker__action-button" type="button">
      <span class="visually-hidden">Редактировать.</span>
    </button>
    <button class="task-tracker__delete task-tracker__action-button" type="reset">
      <span class="visually-hidden">Удалить задачу.</span>
    </button>
    `;

  return task;
};

const toggleEditDisabled = (task) => {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const editButton = task.querySelector('.task-tracker__edit');

  editButton.toggleAttribute('disabled', checkbox.checked);
};

list.querySelectorAll('.task-tracker__item').forEach((task) => {
  createTaskObject(task);
  toggleEditDisabled(task);
});

const onAddButtonClick = (event) => {
  event.preventDefault();

  if (field.classList.contains('task-tracker__field--hide')) {
    field.classList.remove('task-tracker__field--hide');
  } else if (field.value !== '') {
    if (editingTask) {
      const label = editingTask.querySelector('.task-tracker__label');
      label.textContent = field.value;
      label.parentElement.querySelector('.task-tracker__edit').focus();
      editingTask = null;
    } else {
      const task = createTask(field.value);
      createTaskObject(task);
      list.append(task);
      container.classList.remove('task-tracker__wrapper--completed');
      containerMinHeight = container.offsetHeight;
      container.style.setProperty('--container-height', containerMinHeight + 'px');
    }

    field.value = '';
  }
};

const onFieldDeleteButtonClick = () => {
  if (field.value === '') {
    field.classList.add('task-tracker__field--hide');
  } else {
    field.value = '';
  }
};

const onListClick = (event) => {
  if (event.target.classList.contains('task-tracker__delete')) {
    const task = event.target.parentElement;
    deleteTaskObject(task);
    task.remove();

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

addButton.addEventListener('click', onAddButtonClick);
fieldDeleteButton.addEventListener('click', onFieldDeleteButtonClick);
list.addEventListener('click', onListClick);
