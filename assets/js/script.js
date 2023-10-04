/* DOM elements */
const $ = document;
const taskInput = $.getElementById('taskInput');
const tasksCon = $.querySelector('.todo');
const menuContainer = $.getElementById('menuContainer');
const menuContent = $.querySelector('.menuContent');
const menuBtn = $.querySelector(".menuBtn");
const taskEditModal = $.getElementById('taskEditModal');
const tasksSection = $.getElementById('tasksSection');
const colorsMenu = $.querySelector('.colorMenu');
const colors = {
	'rgb(187, 134, 252)': 'pink',
	'rgb(0, 191, 165)': 'teal',
	'rgb(61, 90, 254)': 'indigo',
	'rgb(255, 82, 82)': 'red',
	'rgb(100, 221, 23)': 'green'
};
const textToType = "Get it done!";
const TYPE_DELAY = 100;
const h1Elem = $.querySelector('#tasksHeader h1');
const caret = $.querySelector('.blink-caret');
const completedTasksModal = $.getElementById('completedTasksModal');
const completedTasksTable = completedTasksModal.querySelector('table tbody');

/* Initialize tasks array */
let tasks;

/* --- Helper functions --- */

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
 * @param {any} data - The data to be stored, will be in JSON-stringify form.
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
 * Load tasks from local storage and populate the task list.
 * @param {Array} taskArray - An array containing tasks retrieved from local storage.
 */
function loadStorageTasks(taskArray) {
	tasks = taskArray;
	tasks.forEach(task => {
		task.status ? markTaskAsCompleted(task, true) : addTask(task);
	});
}

/**
 * Type the header text with the animation
 */
function typeText() {
	let i = 0;
	const typeNextCharacter = () => {
		if (i < textToType.length) {
			h1Elem.textContent += textToType.charAt(i);
			i++;
			setTimeout(typeNextCharacter, TYPE_DELAY);
		}
	}
	typeNextCharacter();
}

/**
 * Initializes data from local storage
 */
function initialize() {
	typeText();
	const colorRgbCode = getFromStorage('theme-color', true);
	if (colorRgbCode !== null) {
		selectThemeColor(colorRgbCode);
	}
	const storageTasksArr = getFromStorage('tasks', true);
	if (storageTasksArr !== null && typeof storageTasksArr === 'object') {
		loadStorageTasks(storageTasksArr);
		return;
	}
	tasks = [];
}

function getStorageTaskIndex(id) {
	return tasks.findIndex(task => task.id === Number(id));
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
function createTaskElem(taskId, taskName, taskDesc, taskCreationDate) {
	return `
        <div class="task animate__bounceIn" data-task-id=${taskId}>
          <div>
			<div class="task-actions">
				<span class="fas fa-edit"></span>
            	<span class="fa fa-check done-span"></span>
				<span class="fas fa-times"></span>
			</div>
            <div class="task-info">
              <div class="task-title">${taskName}</div>
              <div class="task-desc">${taskDesc}</div>
            </div>
            <span class="fas fa-info-circle"></span>
            Created:
            <span style="color: var(--theme-color);"> ${taskCreationDate} </span>
          </div>
				<button class="fa fa-check done-btn" aria-hidden="true"></button>
        </div>
	`;
}

/**
 * Resets the input field.
 */
function resetInput() {
	taskInput.value = '';
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
 * Removes a task from the tasks array and updates local storage.
 * @param {Element} taskElem - The task element to be removed.
 */
function removeTask(taskElem) {
	const taskElemId = getTaskId(taskElem);
	const index = getStorageTaskIndex(taskElemId);
	tasks.splice(index, 1);
	setToStorage('tasks', tasks);
	taskElem.parentElement.remove();
}

/**
 * Creates an HTML table row element to represent a completed task.
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} taskTitle - The title or name of the task.
 * @param {string} taskDesc - The description of the task.
 * @param {string} createdAt - The date when the task was created.
 * @param {string} completedAt - The date when the task was completed.
 * @returns {string} - A string containing the HTML markup for the completed task row.
 */
function createCompletedTaskElem(taskId, taskTitle, taskDesc, createdAt, completedAt) {
	return `
    <tr data-task-id="${taskId}">
        <td class="taskId">${taskId}</td>
        <td class="taskTitle">${taskTitle}</td>
        <td class="taskDesc">${taskDesc}</td>
        <td class="taskCreationDate">${createdAt}</td>
        <td class="taskCompletionDate">${completedAt}</td>
        <td class="taskActions">
            <i class="fas fa-trash"></i>
            <i class="fas fa-undo"></i>
        </td>
    </tr>
    `;
}

/**
 * Marks a task as completed and updates the task list. Optionally adds it to the completed tasks table.
 * @param {object} taskData - An object containing task details, including id, name, description, createdAt, and completedAt.
 * @param {boolean} storageTask - Indicates whether the task is stored in local storage. Default is false.
 */
function markTaskAsCompleted(taskData, storageTask = false) {
	const index = getStorageTaskIndex(taskData.id);
	const taskElem = createCompletedTaskElem(
		taskData.id,
		taskData.name,
		taskData.desc,
		taskData.createdAt,
		taskData.completedAt || getCurrentDate()
	);
	if (!storageTask) {
		tasks[index].status = true;
		tasks[index].completedAt = getCurrentDate();
		setToStorage('tasks', tasks);
	}
	completedTasksTable.insertAdjacentHTML('beforeend', taskElem);
}

/**
 * Sets an event listener on a task element to handle marking a task as completed when a user interacts with it.
 * @param {object} taskData - An object containing task details, including id, name, description, createdAt, and completedAt.
 */
function setCompleteTaskEvent(taskData) {
	const taskElem = selectTask(taskData.id);
	if (taskElem === null) return;
	taskElem.addEventListener('click', (event) => {
		if (event.target.classList.contains('fa-check')) {
			markTaskAsCompleted(taskData);
			taskElem.remove();
		}
	});
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
	const taskElem = createTaskElem(taskData.id, taskData.name, taskData.desc, taskData.createdAt);
	tasksCon.insertAdjacentHTML('beforeend', taskElem);
	setCompleteTaskEvent(taskData);
	resetInput();
}

/**
 * Shows or hides a modal element.
 * @param {Element} modalElem - The modal element to be shown or hidden.
 */
function toggleModal(modalElem) {
	modalElem.classList.toggle('showModal');
}

/**
 * Toggles the edit task modal.
 */
function toggleEditModal() {
	toggleModal(taskEditModal);
}

/**
 * Fills the input fields in the edit task modal with data from a task element.
 * @param {Element} taskElem - The task element to retrieve data from.
 */
function fillModalInput(taskElem) {
	const modalId = taskEditModal.querySelector('.taskId');
	const modalTitle = taskEditModal.querySelector('#taskTitle');
	const modalDesc = taskEditModal.querySelector('#taskDescription');
	const taskId = getTaskId(taskElem.parentElement);
	modalId.value = taskId;
	modalTitle.value = taskElem.querySelector('.task-title').textContent;
	modalDesc.value = taskElem.querySelector('.task-desc').textContent;
}

/**
 * Toggles the menu by adding or removing CSS classes.
 *
 * @function
 * @name toggleMenuContent
 *
 * @description
 * This function toggles the visibility of the menu by adding or removing CSS classes.
 * It toggles the "menu-open" class on the menu button and the "show-menu" class on the menu content.
 */
function toggleMenuContent() {
	menuBtn.classList.toggle("menu-open");
	menuContent.classList.toggle('show-menu');
}


/**
 * Updates task data in storage based on the provided task data.
 * @param {object} taskData - The updated task data.
 */
function updateTaskInStorage(taskData) {
	const index = getStorageTaskIndex(taskData.id);
	if (index !== -1) {
		tasks[index].name = taskData.name;
		tasks[index].desc = taskData.desc;
		tasks[index].status = (taskData.status === 'done') ? true : false;
		setToStorage('tasks', tasks);
	}
}

/**
 * Updates the displayed task with the provided task data.
 * @param {object} taskData - The updated task data.
 */
function updateTaskInDom(taskData) {
	const taskElem = selectTask(Number(taskData.id));
	if (taskElem != null) {
		taskElem.querySelector('.task-title').textContent = taskData.name;
		taskElem.querySelector('.task-desc').textContent = taskData.desc;
	}
}

/**
 * Handles saving data from the edit task modal.
 */
function handleSaveModalBtnClick() {
	const form = new FormData(taskEditModal.querySelector('form'));
	const data = {
		id: form.get('task-id'),
		name: form.get('taskTitle'),
		desc: form.get('taskDescription'),
		status: form.get('taskStatus')
	}
	updateTaskInStorage(data);
	updateTaskInDom(data);
	toggleModal(taskEditModal);
}

/**
 * Checks if an HTML element contains a specific CSS class.
 *
 * @param {HTMLElement} element - The HTML element to check.
 * @param {string} className - The CSS class name to look for.
 * @returns {boolean} - `true` if the class is found; otherwise, `false`.
 */
function hasClass(element, className) {
	/**
	 * The `classList.contains` method returns a boolean indicating
	 * whether the specified CSS class is present on the element.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList}
	 */
	return element.classList.contains(className);
}

/**
 * Toggle the visibility of the color selection menu.
 *
 * @function
 * @name toggleColorMenu
 *
 * @description
 * This function toggles the visibility of the color selection menu by adding or removing the "show-menu" class to the `colorsMenu` element.
 */
function toggleColorMenu() {
	colorsMenu.classList.toggle('show-menu');
}

/**
 * Retrieve the name of a color based on its code.
 *
 * @function
 * @name getColorName
 *
 * @param {string} color - The code or name of the color.
 * @returns {string} The name of the color.
 */
function getColorName(color) {
	return colors[color];
}

/**
 * Change the website's favicon to match a selected color theme.
 * @param {string} iconColorName - The name of the color theme.
 */
function changeFavIcon(iconColorName) {
	const favIcon = $.querySelector('#favIcon');
	const favIconPath = `assets/img/icon/fav-${iconColorName}.png`;
	favIcon.href = favIconPath;
}

/**
 * Change the website's logo to match a selected color theme.
 * @param {string} logoColorName - The name of the color theme.
 */
function changeLogo(logoColorName) {
	const logo = $.querySelector('#logo');
	const logoPath = `assets/img/logo/logo-${logoColorName}.png`;
	logo.src = logoPath;
}

/**
 * Select a color theme and update the website's appearance.
 * @param {string} color - The primary color code of the selected theme.
 */
function selectThemeColor(color) {
	const colorName = getColorName(color);
	changeFavIcon(colorName);
	changeLogo(colorName);
	$.documentElement.style.setProperty('--theme-color', color);
}

/**
 * Removes a completed task from the tasks array and updates local storage.
 *
 * @function
 * @name removeCompletedTask
 *
 * @param {Element} completedTaskElem - The completed task element to be removed.
 *
 * @description
 * This function takes a completed task element as input, removes the task from the `tasks` array, updates the local storage, and removes the task element from the DOM.
 */
function removeCompletedTask(completedTaskElem) {
	const index = getStorageTaskIndex(completedTaskElem.dataset.taskId);
	tasks.splice(index, 1);
	setToStorage('tasks', tasks);
	completedTaskElem.remove();
}

/**
 * Undoes a completed task and moves it back to the active tasks list.
 *
 * @function
 * @name undoCompletedTask
 *
 * @param {Element} completedTaskElem - The completed task element to be undone.
 *
 * @description
 * This function takes a completed task element as input, updates the task's status and completion timestamp in the `tasks` array, updates the local storage, adds the task back to the active tasks list in the DOM, and removes the completed task element from the DOM.
 */
function undoCompletedTask(completedTaskElem) {
	const index = getStorageTaskIndex(completedTaskElem.dataset.taskId);
	const taskData = tasks.find(task => task.id === Number(completedTaskElem.dataset.taskId));
	tasks[index].status = false;
	delete tasks[index].completedAt;
	setToStorage('tasks', tasks);
	addTask(taskData);
	completedTaskElem.remove();
}

/* Event listeners */
window.addEventListener('load', initialize);
window.addEventListener('scroll', () => {
	const header = $.querySelector('header');
	if (window.scrollY > 50) {
		header.classList.add('sticky');
		return;
	}
	header.classList.remove('sticky');
});
tasksSection.addEventListener('click', (event) => {
	event.preventDefault();
	const taskElem = event.target.parentElement.parentElement;
	if (hasClass(event.target, 'addTodoBtn')) {
		const taskName = taskInput.value;
		if (taskName) addTask(taskName);
	}
	else if (hasClass(event.target, 'fa-times')) removeTask(taskElem);
	else if (hasClass(event.target, 'fa-edit')) {
		fillModalInput(taskElem);
		toggleModal(taskEditModal);
	};
});
taskEditModal.addEventListener('click', (event) => {
	event.preventDefault();
	if (hasClass(event.target, 'closeButton')) toggleModal(taskEditModal);
	else if (hasClass(event.target, 'saveModal')) handleSaveModalBtnClick();
});
menuContainer.addEventListener('click', (event) => {
	const target = event.target;
	if (hasClass(target, 'menuClose')) toggleMenuContent();
	else if (hasClass(target, 'fa-paint-roller') || hasClass(target, 'colorMenuClose')) toggleColorMenu();
	else if (hasClass(target, 'colorItem')) {
		const colorRgbCode = getComputedStyle(target)['background-color'];
		selectThemeColor(colorRgbCode);
		setToStorage('theme-color', colorRgbCode);
	}
	else if (hasClass(target, 'fa-history')) completedTasksModal.classList.add('showModal');
});
completedTasksModal.addEventListener('click', (event) => {
	const target = event.target;
	if (hasClass(target, 'fa-times')) completedTasksModal.classList.remove('showModal');
	else if (hasClass(target, 'fa-trash')) removeCompletedTask(target.parentElement.parentElement);
	else if (hasClass(target, 'fa-undo')) undoCompletedTask(target.parentElement.parentElement);
})
menuBtn.addEventListener('click', () => toggleMenuContent());