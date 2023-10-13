import { setToStorage, getFromStorage, updateTaskInStorage, loadStorageTasks } from './modules/storageModule.js';
import { updateTaskInDom, removeTask, addTask, getTaskId, selectTask, getTaskData } from './modules/taskModule.js';
import { undoCompletedTask, markTaskAsCompleted } from './modules/completedTaskModule.js';
import { hasClass, toggleClass, getParentElementByClassName } from './modules/utilitiesModule.js';
import { typeText } from './modules/typingAnimationModule.js';
import { selectThemeColor } from './modules/themeModule.js';
import { toggleColorMenu, toggleMenuContent } from './modules/menuModule.js';
import { $, LOCAL_STORAGE_TASKS_KEY } from './modules/constantsModule.js';

const taskInput = $.getElementById('taskInput');
const tasksCon = $.querySelector('.todo');
const menuContainer = $.getElementById('menuContainer');
const menuContent = $.querySelector('.menuContent');
const menuBtn = $.querySelector(".menuBtn");
const taskEditModal = $.getElementById('taskEditModal');
const tasksSection = $.getElementById('tasksSection');

/* Initialize tasks array */
let tasks;

/**
 * Initializes data from local storage and sets up event listeners.
 *
 * @function
 * @name initialize
 *
 * @description Initializes data from local storage and sets up event listeners for the application.
 */
function initialize() {
	typeText();
	const colorRgbCode = getFromStorage('theme-color', true);
	if (colorRgbCode !== null) {
		selectThemeColor(colorRgbCode);
	}
	const storageTasksArr = getFromStorage(LOCAL_STORAGE_TASKS_KEY, true);
	if (storageTasksArr !== null && typeof storageTasksArr === 'object') {
		loadStorageTasks(storageTasksArr, tasksCon);
		tasks = storageTasksArr;
		return;
	}
	tasks = [];
}

/**
 * Fills the input fields in the edit task modal with data from a task element.
 *
 * @function
 * @name fillEditTaskModalInputs
 *
 * @param {Element} taskElem - The task element to retrieve data from.
 *
 * @description Fills the input fields in the edit task modal with data from the selected task element.
 */
function fillEditTaskModalInputs(taskElem) {
	const modalId = taskEditModal.querySelector('.taskId');
	const modalTitle = taskEditModal.querySelector('#taskTitle');
	const modalDesc = taskEditModal.querySelector('#taskDescription');
	modalId.value = getTaskId(taskElem);
	modalTitle.value = taskElem.querySelector('.task-title').textContent;
	modalDesc.value = taskElem.querySelector('.task-desc').textContent;
}

/**
 * Handles saving data from the edit task modal.
 *
 * @function
 * @name handleSaveModalBtnClick
 *
 * @description Handles the click event on the save button in the edit task modal and updates the task data.
 */
function handleSaveModalBtnClick() {
	const form = new FormData(taskEditModal.querySelector('form'));
	const data = {
		id: Number(form.get('task-id')),
		name: form.get('taskTitle'),
		desc: form.get('taskDescription'),
		status: (form.get('taskStatus') === 'done')
	}
	const taskElem = selectTask(data.id, tasksCon);
	if (data.status) {
		console.log(getTaskData(tasks, data.id));
		markTaskAsCompleted(taskElem, getTaskData(tasks, data.id), tasks);
	} else {
		undoCompletedTask(taskElem, tasks);
	}
	updateTaskInDom(selectTask(data.id, tasksCon), tasksCon);
	updateTaskInStorage(getStorageTaskIndex(data.id, tasksArr), tasks);
	toggleClass(taskEditModal, 'showModal');
}

/* --- Event listeners --- */
window.addEventListener('load', initialize);

window.addEventListener('scroll', () => {
	const header = $.querySelector('header');
	console.log(window);
	if (window.scrollY > 59) {
		header.classList.add('sticky');
		return;
	} else if (window.scrollY < 51) {
		header.classList.remove('sticky');
	}
});

tasksSection.addEventListener('click', (event) => {
	event.preventDefault();
	const target = event.target;
	const taskElem = getParentElementByClassName(target, 'task');
	if (hasClass(target, 'addTodoBtn')) {
		const taskName = taskInput.value;
		if (taskName) addTask(taskName, tasksCon, tasks, false);
	}
	else if (hasClass(target, 'fa-times')) removeTask(taskElem, tasks);
	else if (hasClass(target, 'fa-edit')) {
		fillEditTaskModalInputs(taskElem);
		toggleClass(taskEditModal, 'showModal');
	}
	else if (hasClass(target, 'fa-undo')) undoCompletedTask(taskElem, tasks);
	else if (hasClass(target, 'done-span') || hasClass(target, 'done-btn')) {
		const taskId = getTaskId(taskElem);
		const taskData = getTaskData(tasks, taskId);
		markTaskAsCompleted(taskElem, taskData, tasks);
	}
});

taskEditModal.addEventListener('click', (event) => {
	event.preventDefault();
	if (hasClass(event.target, 'closeButton')) toggleClass(taskEditModal, 'showModal');
	else if (hasClass(event.target, 'saveModal')) handleSaveModalBtnClick();
});

menuContainer.addEventListener('click', (event) => {
	const target = event.target;
	if (hasClass(target, 'menuClose')) toggleMenuContent(menuBtn, menuContent);
	else if (hasClass(target, 'fa-paint-roller') || hasClass(target, 'colorMenuClose')) toggleColorMenu();
	else if (hasClass(target, 'colorItem')) {
		const colorRgbCode = getComputedStyle(target)['background-color'];
		selectThemeColor(colorRgbCode);
		setToStorage('theme-color', colorRgbCode);
	}
	else if (hasClass(target, 'fa-history')) toggleClass(completedTasksModal, 'showModal');
});

})
menuBtn.addEventListener('click', () => toggleMenuContent(menuBtn, menuContent));

document.addEventListener('keyup', (event) => {
	if (event.key === 'Escape') {
		if (hasClass(taskEditModal, 'showModal')) toggleClass(taskEditModal, 'showModal');
		else if (hasClass(completedTasksModal, 'showModal')) toggleClass(completedTasksModal, 'showModal');
		else if (hasClass(menuContent, 'show-menu')) toggleMenuContent(menuBtn, menuContent);
	}
});