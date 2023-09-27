// DOM elements
const $ = document;
const todoInput = $.querySelector('.todo-input');
const addTaskBtn = $.querySelector('.todo-btn');
const tasksCon = $.querySelector('.todo');
const menuBg = $.querySelector('.menu-bg');
const closeBgBtn = $.querySelector('.menu-bg .fa-times');
const menuBtn = $.querySelector(".menu-btn");
const editTaskModal = $.querySelector('#editTaskModal');

// Initialize tasks array
let tasks;

/**
 * Sets data to the local storage.
 * @param {string} key - The key to store the data under.
 * @param {any} data - The data to be stored, will be JSON-stringified.
 */
function setToStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieves data from the local storage.
 * @param {string} key - The key to retrieve data from.
 * @param {boolean} json - Whether to parse the retrieved data as JSON.
 * @returns {any} - The retrieved data.
 */
function getFromStorage(key, json = true) {
	const data = localStorage.getItem(key);
	return json ? JSON.parse(data) : data;
}


// Initialize tasks from local storage
function initialize() {
	const storageData = getFromStorage('tasks', true);
	if (storageData == null || typeof storageData != 'object') {
		tasks = [];
		return;
	}
	tasks = storageData;
	tasks.forEach(task => addTask(task));
}

// --- Helper functions --- //

/**
 * Retrieves the last ID among the tasks.
 * @returns {number} - The last task ID or 0 if there are no tasks.
 */
function getLastId() {
	if (tasks.length < 1) return 0;
	let lastId = 0;
	tasks.forEach(task => {
		if (task.id > lastId) lastId = task.id;
	});
	return lastId;
}

/**
 * Sets data to the local storage.
 * @param {string} key - The key to store the data under.
 * @param {any} data - The data to be stored, will be JSON-stringified.
 */
function setToStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieves data from the local storage.
 * @param {string} key - The key to retrieve data from.
 * @param {boolean} json - Whether to parse the retrieved data as JSON.
 * @returns {any} - The retrieved data.
 */
function getFromStorage(key, json = true) {
	const data = localStorage.getItem(key);
	return json ? JSON.parse(data) : data;
}

/**
 * Initializes tasks from local storage or sets an empty array if no data is found.
 */
function initialize() {
	const storageData = getFromStorage('tasks', true);
	if (storageData == null || typeof storageData != 'object') {
		tasks = [];
		return;
	}
	tasks = storageData;
	tasks.forEach(task => addTask(task));
}
/**
 * Gets the current date in the format MM/DD/YYYY.
 * @returns {string} - The current date.
 */
function getCurrentDate() {
	const d = new Date();
	return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * Creates a task object with default values.
 * @param {string} taskName - The name of the task.
 * @returns {object} - The task object.
 */
function createTaskObj(taskName) {
	return { id: getLastId() + 1, name: taskName, desc: '', createdAt: getCurrentDate(), status: false };
}

/**
 * Creates the HTML for a task element.
 * @param {object} taskData - The task data.
 * @returns {string} - The HTML for the task element.
 */
function createTaskElem(taskData) {
	return `
        <div class="task" data-task-id=${taskData.id}>
          <a href="">
            <span class="fas fa-edit"></span>
            <span class="fas fa-times"></span>
            <div class="task-info">
              <div class="task-title">${taskData.name}</div>
              <div class="task-desc">${taskData.desc}</div>
            </div>
            <span class="fas fa-info-circle"></span>
            Created:
            <span style="color: #bb86fc;"> ${taskData.createdAt} </span>
          </a>
        </div>
	`;
}

/**
 * Resets the input field.
 */
function resetInput() {
	todoInput.value = '';
}

/**
 * Selects a task element by its ID.
 * @param {number} taskId - The ID of the task.
 * @returns {Element|null} - The selected task element or null if not found.
 */
function selectTask(taskId) {
	return tasksCon.querySelector(`[data-task-id="${taskId}"]`) || null;
}

/**
 * Gets the ID of a task element.
 * @param {Element} taskElem - The task element.
 * @returns {number} - The ID of the task.
 */
function getTaskId(taskElem) {
	return Number(taskElem.dataset.taskId);
}

/**
 * Removes a task element from the DOM.
 * @param {Element} taskElem - The task element to be removed.
 */
function removeTaskElem(taskElem) {
	taskElem.remove();
}

/**
 * Removes a task from the tasks array and updates local storage.
 * @param {Element} taskElem - The task element to be removed.
 */
function removeTask(taskElem) {
	const taskElemId = getTaskId(taskElem);
	const index = tasks.findIndex(taskObj => taskObj.id == taskElemId);
	tasks.splice(index, 1);
	setToStorage('tasks', tasks);
	removeTaskElem(taskElem);
}

/**
 * Adds a task to the tasks array and updates local storage.
 * @param {object|string} taskData - The task data or task name.
 */
function addTask(taskData) {
	if (typeof taskData != 'object') {
		taskData = createTaskObj(taskData);
		tasks.push(taskData);
		setToStorage('tasks', tasks);
	}
	const taskElem = createTaskElem(taskData);
	tasksCon.insertAdjacentHTML('beforeend', taskElem);
	resetInput();
}

/**
 * Handles adding a task when the "Add" button is clicked.
 */
function addTodoHandler() {
	const taskName = todoInput.value;
	if (!taskName) return;
	addTask(taskName);
}

/**
 * Shows or hides a modal element.
 * @param {Element} modalElem - The modal element to be shown or hidden.
 */
function showModal(modalElem) {
	const modalDisplay = getComputedStyle(modalElem).display;
	if (!modalDisplay) return;
	modalElem.style.display = (modalDisplay == 'none') ? 'block' : 'none';
}

/**
 * Toggles the edit task modal.
 */
function toggleEditModal() {
	showModal(editTaskModal);
}

/**
 * Fills the input fields in the edit task modal with data from a task element.
 * @param {Element} taskElem - The task element to retrieve data from.
 */
function fillModalInput(taskElem) {
	const modalId = editTaskModal.querySelector('.task-id');
	const modalTitle = editTaskModal.querySelector('#taskTitle');
	const modalDesc = editTaskModal.querySelector('#taskDescription');
	const modalStatus = editTaskModal.querySelector('#taskStatus');
	const taskId = getTaskId(taskElem);
	modalId.value = taskId;
	modalTitle.value = taskElem.querySelector('.task-title').textContent;
	modalDesc.value = taskElem.querySelector('.task-desc').textContent;
}

/**
 * Handles editing a task when the edit icon is clicked.
 * @param {Element} taskElem - The task element to be edited.
 */
function editTaskHandler(taskElem) {
	fillModalInput(taskElem);
	toggleEditModal();
}

/**
 * Toggles the menu by adding or removing CSS classes.
 */
function toggleMenu() {
	menuBtn.classList.toggle("menu-open");
	menuBg.classList.toggle('show-menu-bg');
}

/**
 * Handles clicks within the task container.
 */
function taskConHandler() {
	event.preventDefault();
	const taskElem = event.target.parentElement.parentElement;
	if (event.target.classList.contains('fa-times')) removeTaskHandler(taskElem);
	if (event.target.classList.contains('fa-edit')) editTaskHandler(taskElem);
}

/**
 * Updates task data in storage based on the provided task data.
 * @param {object} taskData - The updated task data.
 */
function updateStorageTask(taskData) {
	const index = tasks.findIndex(task => Number(task.id) === Number(taskData.id));
	if (index != -1) {
		tasks[index].name = taskData.name;
		tasks[index].desc = taskData.desc;
		tasks[index].status = taskData.status;
		setToStorage('tasks', tasks);
	}
}

/**
 * Updates the displayed task with the provided task data.
 * @param {object} taskData - The updated task data.
 */
function updateTask(taskData) {
	const taskElem = selectTask(Number(taskData.id));
	if (taskElem != null) {
		taskElem.querySelector('.task-title').textContent = taskData.name;
		taskElem.querySelector('.task-desc').textContent = taskData.desc;
	}
}

/**
 * Handles saving data from the edit task modal.
 */
function saveModalHandler() {
	const form = new FormData(editTaskModal.querySelector('form'));
	const data = {
		id: form.get('task-id'),
		name: form.get('taskTitle'),
		desc: form.get('taskDescription'),
		status: form.get('taskStatus')
	}
	updateStorageTask(data);
	updateTask(data);
	toggleEditModal();
}


/**
 * Handles clicks on the menu background to toggle the menu.
 */
function menuBgHandler() {
	if (event.target.classList.contains('fa-times')) toggleMenu();
}

/**
 * Handles removing a task element and its associated data.
 * @param {Element} taskElem - The task element to be removed.
 */
function removeTaskHandler(taskElem) {
	removeTask(taskElem);
}

/**
 * Handles removing a task.
 * @param {Element} taskElem - The task element to be removed.
 */
function removeTaskHandler(taskElem) {
	removeTask(taskElem);
}

/**
 * Handles events in the edit task modal.
 */
function editTaskModalHandler() {
	if (event.target.classList.contains('close-button')) toggleEditModal();
	if (event.target.classList.contains('save-modal')) saveModalHandler();
}

/**
 * Handles events in the edit task modal.
 * If the event target contains the 'close-button' class, it closes the modal.
 * If the event target contains the 'save-modal' class, it triggers the saveModalHandler function.
 */
function editTaskModalHandler() {
	if (event.target.classList.contains('close-button')) toggleEditModal();
	if (event.target.classList.contains('save-modal')) saveModalHandler();
}

/**
 * Resets the edit task modal.
 */
function resetModal() {
	const taskId = Number(editTaskModal.querySelector('.task-id').value);
	const taskData = tasks.find(task => task.id === taskId);
	if (taskData) {
		fillModalInput();
	}
}

// Event listeners
window.addEventListener('load', initialize);
addTaskBtn.addEventListener('click', addTodoHandler);
tasksCon.addEventListener('click', taskConHandler);
menuBg.addEventListener('click', menuBgHandler);
menuBtn.addEventListener("click", toggleMenu);
editTaskModal.addEventListener('click', editTaskModalHandler);
