'use strict';

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'css/style.css';
document.head.append(stylesheet);

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'assets/favicon.svg';
document.head.append(favicon);

// страница
const page = document.createElement('main');
page.className = 'page';

const header = document.createElement('header');
header.className = 'header';

const title = document.createElement('h1');
title.textContent = 'Мой To-Do List';

const subtitle = document.createElement('p');
subtitle.className = 'subtitle';
subtitle.textContent = 'Список дел на каждый день';

header.append(title, subtitle);

// приложение
const todoApp = document.createElement('section');
todoApp.className = 'todo-app';

const formTitle = document.createElement('h2');
formTitle.textContent = 'Новая задача';

const taskForm = document.createElement('form');
taskForm.className = 'task-form';

const taskInput = document.createElement('input');
taskInput.type = 'text';
taskInput.name = 'task';
taskInput.placeholder = 'Что нужно сделать?';
taskInput.setAttribute('aria-label', 'Название задачи');
taskInput.required = true;

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.name = 'date';
dateInput.setAttribute('aria-label', 'Дата выполнения');

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.className = 'button button-primary';
addButton.textContent = 'Добавить';

taskForm.append(taskInput, dateInput, addButton);

// управление списком
const controls = document.createElement('div');
controls.className = 'controls';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск задач...';
searchInput.setAttribute('aria-label', 'Поиск задач');

const filterSelect = document.createElement('select');
filterSelect.setAttribute('aria-label', 'Фильтр задач');

const filterOptions = [
    { value: 'all', text: 'Все задачи' },
    { value: 'active', text: 'Невыполненные' },
    { value: 'completed', text: 'Выполненные' }
];

filterOptions.forEach(function (optionData) {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    filterSelect.append(option);
});

const sortSelect = document.createElement('select');
sortSelect.setAttribute('aria-label', 'Сортировка задач');

const sortOptions = [
    { value: 'manual', text: 'По добавлению' },
    { value: 'date-asc', text: 'Сначала ближайшие' },
    { value: 'date-desc', text: 'Сначала дальние' }
];

sortOptions.forEach(function (optionData) {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    sortSelect.append(option);
});

controls.append(searchInput, filterSelect, sortSelect);

// задачи
const listTitle = document.createElement('h2');
listTitle.textContent = 'Мои задачи';

const taskList = document.createElement('ul');
taskList.className = 'task-list';

const emptyMessage = document.createElement('p');
emptyMessage.className = 'empty-message';
emptyMessage.textContent = 'Пока задач нет. Добавь первую!';

taskList.append(emptyMessage);

const taskCounter = document.createElement('p');
taskCounter.className = 'task-counter';
taskCounter.textContent = 'Всего задач: 0';

todoApp.append(
    formTitle,
    taskForm,
    controls,
    listTitle,
    taskList,
    taskCounter
);

page.append(header, todoApp);
document.body.append(page);


function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('todoTasks');

        if (savedTasks === null) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(function (task) {
            return (
                task !== null &&
                typeof task === 'object' &&
                Number.isInteger(task.id) &&
                typeof task.title === 'string' &&
                typeof task.completed === 'boolean' &&
                typeof task.date === 'string'
            );
        });
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Не удалось сохранить задачи:', error);
    }
}

let tasks = loadTasks();

let nextTaskId = tasks.reduce(function (maxId, task) {
    return Math.max(maxId, task.id);
}, 0) + 1;

function createTaskElement(task) {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.dataset.taskId = String(task.id);
    item.draggable = sortSelect.value === 'manual' &&
        searchInput.value.trim() === '' &&
        filterSelect.value === 'all';

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Отметить задачу выполненной');

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';

    const taskName = document.createElement('span');
    taskName.className = 'task-name';
    taskName.textContent = task.title;

    if (task.completed) {
        taskName.classList.add('completed');
    }

    taskDetails.append(taskName);

    if (task.date) {
        const taskDate = document.createElement('span');
        taskDate.className = 'task-date';
        taskDate.textContent = 'Срок: ' + task.date;
        taskDetails.append(taskDate);
    }

    checkbox.addEventListener('change', function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    taskInfo.append(checkbox, taskDetails);

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'button button-edit';
    editButton.textContent = 'Изменить';
    editButton.setAttribute('aria-label', 'Изменить задачу: ' + task.title);

    editButton.addEventListener('click', function () {
        const editForm = document.createElement('form');
        editForm.className = 'edit-form';

        const editTitle = document.createElement('input');
        editTitle.type = 'text';
        editTitle.value = task.title;
        editTitle.required = true;
        editTitle.maxLength = 200;
        editTitle.setAttribute('aria-label', 'Название задачи');

        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = task.date;
        editDate.setAttribute('aria-label', 'Дата задачи');

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'button button-primary';
        saveButton.textContent = 'Сохранить';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'button button-secondary';
        cancelButton.textContent = 'Отмена';

        editForm.append(editTitle, editDate, saveButton, cancelButton);

        editForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const newTitle = editTitle.value.trim();

            if (newTitle === '') {
                editTitle.setCustomValidity('Введите название задачи');
                editTitle.reportValidity();
                editTitle.setCustomValidity('');
                return;
            }

            task.title = newTitle;
            task.date = editDate.value;
            saveTasks();
            renderTasks();
        });

        cancelButton.addEventListener('click', renderTasks);

        item.replaceChildren(editForm);
        editTitle.focus();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button-danger';
    deleteButton.textContent = 'Удалить';
    deleteButton.setAttribute('aria-label', 'Удалить задачу: ' + task.title);

    deleteButton.addEventListener('click', function () {
        tasks = tasks.filter(function (currentTask) {
            return currentTask.id !== task.id;
        });

        saveTasks();
        renderTasks();
    });

    taskActions.append(editButton, deleteButton);
    item.append(taskInfo, taskActions);

    item.addEventListener('dragstart', function (event) {
        if (
            sortSelect.value !== 'manual' ||
            searchInput.value.trim() !== '' ||
            filterSelect.value !== 'all'
        ) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.setData('text/plain', String(task.id));
        event.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
    });

    item.addEventListener('dragend', function () {
        item.classList.remove('dragging');
        taskList.querySelectorAll('.task-item').forEach(function (element) {
            element.classList.remove('drag-over');
        });
    });

    item.addEventListener('dragover', function (event) {
        if (sortSelect.value !== 'manual') {
            return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', function () {
        item.classList.remove('drag-over');
    });

    item.addEventListener('drop', function (event) {
        event.preventDefault();
        item.classList.remove('drag-over');

        if (
            sortSelect.value !== 'manual' ||
            searchInput.value.trim() !== '' ||
            filterSelect.value !== 'all'
        ) {
            return;
        }

        const draggedId = Number(event.dataTransfer.getData('text/plain'));
        const draggedIndex = tasks.findIndex(function (currentTask) {
            return currentTask.id === draggedId;
        });
        const targetIndex = tasks.findIndex(function (currentTask) {
            return currentTask.id === task.id;
        });

        if (
            draggedIndex === -1 ||
            targetIndex === -1 ||
            draggedIndex === targetIndex
        ) {
            return;
        }

        const draggedTask = tasks.splice(draggedIndex, 1)[0];
        tasks.splice(targetIndex, 0, draggedTask);

        saveTasks();
        renderTasks();
    });

    return item;
}

function renderTasks() {
    taskList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;

    let visibleTasks = tasks.filter(function (task) {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            filterValue === 'all' ||
            (filterValue === 'active' && !task.completed) ||
            (filterValue === 'completed' && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (sortValue === 'date-asc') {
        visibleTasks.sort(function (a, b) {
            if (!a.date) { return 1; }
            if (!b.date) { return -1; }
            return a.date.localeCompare(b.date);
        });
    }

    if (sortValue === 'date-desc') {
        visibleTasks.sort(function (a, b) {
            if (!a.date) { return 1; }
            if (!b.date) { return -1; }
            return b.date.localeCompare(a.date);
        });
    }

    if (visibleTasks.length === 0) {
        const message = document.createElement('li');
        message.className = 'empty-message';

        if (tasks.length === 0) {
            message.textContent = 'Пока задач нет. Добавь первую!';
        } else {
            message.textContent = 'Задачи не найдены.';
        }

        taskList.append(message);
    } else {
        visibleTasks.forEach(function (task) {
            taskList.append(createTaskElement(task));
        });
    }

    const completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

    taskCounter.textContent =
        'Всего задач: ' + tasks.length +
        ' • Выполнено: ' + completedCount;
}

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === '') {
        return;
    }

    const task = {
        id: nextTaskId,
        title: title,
        date: dateInput.value,
        completed: false
    };

    nextTaskId += 1;
    tasks.push(task);

    taskForm.reset();
    taskInput.focus();

    renderTasks();
});

renderTasks();

searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);