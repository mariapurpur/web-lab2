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
    { value: 'manual', text: 'Мой порядок' },
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

let tasks = [];
let nextTaskId = 1;

function createTaskElement(task) {
    const item = document.createElement('li');
    item.className = 'task-item';

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        'aria-label',
        'Отметить задачу выполненной'
    );

    const taskName = document.createElement('span');
    taskName.className = 'task-name';
    taskName.textContent = task.title;

    if (task.completed) {
        taskName.classList.add('completed');
    }

    checkbox.addEventListener('change', function () {
        task.completed = checkbox.checked;
        renderTasks();
    });

    taskInfo.append(checkbox, taskName);

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button-danger';
    deleteButton.textContent = 'Удалить';

    deleteButton.addEventListener('click', function () {
        tasks = tasks.filter(function (currentTask) {
            return currentTask.id !== task.id;
        });

        renderTasks();
    });

    taskActions.append(deleteButton);

    item.append(taskInfo, taskActions);

    return item;
}

function renderTasks() {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        taskList.append(emptyMessage);
    } else {
        tasks.forEach(function (task) {
            taskList.append(createTaskElement(task));
        });
    }

    taskCounter.textContent = 'Всего задач: ' + tasks.length;
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