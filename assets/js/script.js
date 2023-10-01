// DOM elements
const $ = document;
const taskNameInput = $.getElementById('taskInput');
const tasksCon = $.querySelector('.todo');
const menuCon = $.getElementById('menuContainer');
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
const h1Elem = $.querySelector('#tasksHeader h1');
const caret = $.querySelector('.blink-caret');


// Initialize tasks array
let tasks;

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
	tasks.forEach(task => addTask(task));
}

/**
 * Type the header text with the animation
 */
function typeText() {
	let i = 0;
	function typeNextCharacter() {
		if (i < textToType.length) {
			h1Elem.textContent += textToType.charAt(i);
			i++;
			setTimeout(typeNextCharacter, 100);
		} else {
			setInterval(() => {
				caret.style.display = 'none';
			}, 3200);
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
        <div class="task" data-task-id=${taskId}>
          <div>
            <span class="fas fa-edit"></span>
            <span class="fas fa-times"></span>
            <div class="task-info">
              <div class="task-title">${taskName}</div>
              <div class="task-desc">${taskDesc}</div>
            </div>
            <span class="fas fa-info-circle"></span>
            Created:
            <span style="color: var(--theme-color);"> ${taskCreationDate} </span>
          </div>
        </div>
	`;
}

/**
 * Resets the input field.
 */
function resetInput() {
	taskNameInput.value = '';
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
	const index = tasks.findIndex(taskObj => taskObj.id === taskElemId);
	tasks.splice(index, 1);
	setToStorage('tasks', tasks);
	taskElem.remove();
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
	resetInput();
}

/**
 * Handles adding a task when the "Add" button is clicked.
 */
function handleAddTaskBtnClick() {
	const taskName = taskNameInput.value;
	if (!taskName) return;
	addTask(taskName);
}

/**
 * Shows or hides a modal element.
 * @param {Element} modalElem - The modal element to be shown or hidden.
 */
function toggleModal(modalElem) {
	const modalDisplay = getComputedStyle(modalElem).display;
	if (!modalDisplay) return;
	modalElem.style.display = (modalDisplay === 'none') ? 'block' : 'none';
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
	// const modalStatus = taskEditModal.querySelector('#taskStatus');
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
function toggleMenuContent() {
	menuBtn.classList.toggle("menu-open");
	menuContent.classList.toggle('show-menu');
}

/**
 * Updates task data in storage based on the provided task data.
 * @param {object} taskData - The updated task data.
 */
function updateTaskInStorage(taskData) {
	const index = tasks.findIndex(task => Number(task.id) === Number(taskData.id));
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
	toggleEditModal();
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
 */
function toggleColorMenu() {
	// Get the color menu element and toggle the 'show-menu' class
	colorsMenu.classList.toggle('show-menu');
}

/**
 * Retrieve the name of a color based on its code.
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
	// Get the favicon element and update its path
	const favIcon = $.querySelector('#favIcon');
	const favIconPath = `assets/img/icon/fav-${iconColorName}.png`;
	favIcon.href = favIconPath;
}

/**
 * Change the website's logo to match a selected color theme.
 * @param {string} logoColorName - The name of the color theme.
 */
function changeLogo(logoColorName) {
	// Get the logo element and update its source path
	const logo = $.querySelector('#logo');
	const logoPath = `assets/img/logo/logo-${logoColorName}.png`;
	logo.src = logoPath;
}

/**
 * Select a color theme and update the website's appearance.
 * @param {string} color - The primary color code of the selected theme.
 */
function selectThemeColor(color) {
	// Get the name of the color based on its code
	const colorName = getColorName(color);

	// Update favicon, logo, and CSS variable for theme color
	changeFavIcon(colorName);
	changeLogo(colorName);
	$.documentElement.style.setProperty('--theme-color', color);
}

// Event listeners
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
	if (hasClass(event.target, 'todoBtn')) handleAddTaskBtnClick();
	else if (hasClass(event.target, 'fa-times')) removeTask(taskElem);
	else if (hasClass(event.target, 'fa-edit')) editTaskHandler(taskElem);
});
taskEditModal.addEventListener('click', (event) => {
	event.preventDefault();
	if (hasClass(event.target, 'closeButton')) toggleEditModal();
	else if (hasClass(event.target, 'saveModal')) handleSaveModalBtnClick();
});
menuCon.addEventListener('click', (event) => {
	const target = event.target;
	if (hasClass(target, 'menuClose')) toggleMenuContent();
	else if (hasClass(target, 'fa-paint-roller') || hasClass(target, 'colorMenuClose')) toggleColorMenu();
	else if (hasClass(target, 'colorItem')) {
		const colorRgbCode = getComputedStyle(target)['background-color'];
		selectThemeColor(colorRgbCode);
		setToStorage('theme-color', colorRgbCode);
	};
});
menuBtn.addEventListener('click', () => toggleMenuContent());