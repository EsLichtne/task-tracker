const container = document.querySelector('.task-tracker__wrapper');
const list = document.querySelector('.task-tracker__list');
const field = document.querySelector('.task-tracker__field');
const addButton = document.querySelector('.task-tracker__add-button');
const fieldDeleteButton = field.parentElement.querySelector('.task-tracker__delete');
let editingTask = null;

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
      list.append(createTask(field.value));
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
    event.target.parentElement.remove();

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
    const label = event.target.parentElement.querySelector('.task-tracker__label')
    field.value = label.textContent;
    field.classList.remove('task-tracker__field--hide');
    field.focus();
    editingTask = event.target.parentElement;
  }

  toggleEditDisabled(event.target.parentElement);
};

addButton.addEventListener('click', onAddButtonClick);
fieldDeleteButton.addEventListener('click', onFieldDeleteButtonClick);
list.addEventListener('click', onListClick);
