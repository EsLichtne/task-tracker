const container = document.querySelector('.task-tracker__wrapper');
const form = document.querySelector('.task-tracker__form');
const list = document.querySelector('.task-tracker__list');
const field = document.querySelector('.task-tracker__field');
const fieldDeleteButton = field.parentElement.querySelector('.task-tracker__delete');
let editingTask = null;

let containerMinHeight = container.offsetHeight;
setContainerHeight();

// Массив задач по умолчанию
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

// Проверяет, пуст ли список задач и переключает класс контейнера
function checkEmptyList() {
  container.classList.toggle('task-tracker__wrapper--completed', list.children.length === 0);
};

// Задаёт высоту контейнера
function setContainerHeight() {
  containerMinHeight = container.offsetHeight;
  container.style.setProperty('--container-height', containerMinHeight + 'px');
}

// Проверяет, есть ли данные о задачах в localStorage; если есть, то загружает их
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
} else {
  tasks.forEach((task) => renderTask(task));
}

// Сохраняет данные о задачах в localStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

saveToLocalStorage();

// Создаёт HTML-элемент задачи и добавляет его в список задач
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

// Добавляет новую задачу в массив задач и рендерит её на странице
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

// Обрабатывает событие отправки формы
function onFormSubmit(event) {
  event.preventDefault();

  if (field.classList.contains('task-tracker__field--hide')) {
    // Отображает поле ввода
    field.classList.remove('task-tracker__field--hide');
  } else if (field.value !== '') {
    if (editingTask) {
      // Редактирует задачу
      const label = editingTask.querySelector('.task-tracker__label');
      label.textContent = field.value;
      label.parentElement.querySelector('.task-tracker__edit').focus();
      updateTask(editingTask);
      editingTask = null;
    } else {
      // Добавляет новую задачу
      addTask(field.value);
      container.classList.remove('task-tracker__wrapper--completed');
    }
  }

  field.value = '';
};

// Обрабатывает событие клика по кнопке очистки поля ввода
function onFieldDeleteButtonClick() {
  if (field.value === '') {
    // Скрывает поле ввода
    field.classList.add('task-tracker__field--hide');
  } else {
    // Очищает поле ввода
    field.value = '';
  }
};

// Удаляет задачу
function deleteTask(task) {
  const id = task.querySelector('.task-tracker__checkbox').id;
  tasks = tasks.filter((task) => String(task.id) !== id);
  task.remove();
  saveToLocalStorage();
};

// Обновляет данные задачи
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

// Устанавливает блокировку для всех выполненных задач
list.querySelectorAll('.task-tracker__item').forEach((item) => {
  toggleEditDisabled(item);
});

// Блокирует кнопку редактирования для выполненных задач
function toggleEditDisabled(task) {
  const checkbox = task.querySelector('.task-tracker__checkbox');
  const editButton = task.querySelector('.task-tracker__edit');

  editButton.toggleAttribute('disabled', checkbox.checked);
};

// Отмечает задачу как выполненную / невыполненную
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

// Обрабатывает события клика на элементах задач
function onListClick(event) {

  // Событие клика на кнопку удаления
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

  // Событие клика на кнопку редактирования
  if (event.target.classList.contains('task-tracker__edit')) {
    const task = event.target.parentElement;
    const label = task.querySelector('.task-tracker__label')
    field.value = label.textContent;
    field.classList.remove('task-tracker__field--hide');
    field.focus();
    editingTask = task;
  }

  // Событие клика на чекбокс
  if (event.target.classList.contains('task-tracker__checkbox')) {
    const task = event.target.parentElement;
    toggleEditDisabled(task);
    toggleTaskChecked(task);
  }
};

list.addEventListener('click', onListClick);
form.addEventListener('submit', onFormSubmit);
fieldDeleteButton.addEventListener('click', onFieldDeleteButtonClick);
