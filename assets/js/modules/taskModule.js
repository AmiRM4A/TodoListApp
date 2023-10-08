import { getCurrentDate, resetInput, hasClass } from './utilitiesModule.js';
import { markTaskAsCompleted } from './completedTaskModule.js';
import { setToStorage, getStorageTaskIndex } from './storageModule.js';
import { LOCAL_STORAGE_TASKS_KEY } from './constantsModule.js';

/**
 * Sets an event listener on a task element to handle marking a task as completed when a user interacts with it.
 *
 * @function
 * @name setCompleteTaskEvent
 *
 * @param {object} taskData - An object containing task details, including id, name, description, createdAt, and completedAt.
 * @param {Element} tasksContainer - The container element for displaying tasks in the DOM.
 * @param {Array} tasksArr - The array containing task data.
 *
 * @description Sets an event listener on a task element to handle marking a task as completed when a user interacts with it.
 */
function setCompleteTaskEvent(taskData, tasksContainer, tasksArr) {
	const taskElem = selectTask(taskData.id, tasksContainer);
	if (taskElem === null) return;
	taskElem.addEventListener('click', (event) => {
		if (hasClass(event.target, 'fa-check')) {
			markTaskAsCompleted(taskData, false, tasksArr);
			taskElem.remove();
		}
	});
}

/**
 * Selects a task element by its ID.
 *
 * @function
 * @name selectTask
 *
 * @param {number} taskId - The ID of the task.
 * @param {Element} tasksContainer - The container element for displaying tasks in the DOM.
 * @returns {Element|null} - The selected task element or null if not found.
 *
 * @description Selects a task element in the DOM by its ID.
 */
function selectTask(taskId, tasksContainer) {
	return tasksContainer.querySelector(`[data-task-id="${taskId}"]`) || null;
}

/**
 * Creates a task object with default values.
 *
 * @function
 * @name createTaskObj
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} taskName - The name of the task.
 * @returns {object} - The task object.
 *
 * @description Creates a task object with default values based on the provided ID and name.
 */
function createTaskObj(taskId, taskName) {
	return { id: taskId, name: taskName, desc: '(edit task for description)', createdAt: getCurrentDate(), status: false };
}

/**
 * Creates the HTML for a task element.
 *
 * @function
 * @name createTaskElem
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} taskName - The name of the task.
 * @param {string} taskDesc - The description of the task.
 * @param {string} taskCreationDate - The date when the task was created.
 * @returns {string} - The HTML for the task element.
 *
 * @description Creates the HTML markup for a task element based on provided data.
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
 * Updates the displayed task with the provided task data.
 *
 * @function
 * @name updateTaskInDom
 *
 * @param {object} taskData - The updated task data.
 * @param {Element} tasksContainer - The container element for displaying tasks in the DOM.
 *
 * @description Updates the displayed task element with the provided task data in the DOM.
 */
function updateTaskInDom(taskData, tasksContainer) {
	const taskElem = selectTask(Number(taskData.id), tasksContainer);
	if (taskElem != null) {
		taskElem.querySelector('.task-title').textContent = taskData.name;
		taskElem.querySelector('.task-desc').textContent = taskData.desc;
	}
}

/**
 * Gets the ID of a task element.
 *
 * @function
 * @name getTaskId
 *
 * @param {Element} taskElem - The task element.
 * @returns {number} - The ID of the task.
 *
 * @description Gets the ID of a task element in the DOM.
 */
function getTaskId(taskElem) {
	return Number(taskElem.parentElement.dataset.taskId);
}

/**
 * Retrieves the last ID among the tasks.
 *
 * @function
 * @name getLastTaskId
 *
 * @param {Array} tasksArr - An array containing task data.
 * @returns {number} - The last task ID or 0 if there are no tasks.
 *
 * @description Retrieves the ID of the last task in the provided array of tasks.
 */
function getLastTaskId(tasksArr) {
	if (tasksArr.length < 1) return 0;
	let lastId = 0;
	tasksArr.forEach(task => {
		if (task.id > lastId) lastId = task.id;
	});
	return lastId;
}

/**
 * Removes a task from the tasks array and updates local storage.
 *
 * @function
 * @name removeTask
 *
 * @param {Element} taskElem - The task element to be removed.
 * @param {Array} tasksArr - An array containing task data.
 *
 * @description Removes a task from the tasks array and updates local storage accordingly.
 */
function removeTask(taskElem, tasksArr) {
	const taskElemId = getTaskId(taskElem);
	const index = getStorageTaskIndex(taskElemId, tasksArr);
	tasksArr.splice(index, 1);
	setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	taskElem.parentElement.remove();
}

/**
 * Adds a task to the tasks array and updates local storage.
 *
 * @function
 * @name addTask
 *
 * @param {object|string} taskData - The task data or task name.
 * @param {Element} tasksContainer - The container element for displaying tasks in the DOM.
 * @param {Array} tasksArr - An array containing task data.
 *
 * @description Adds a task to the tasks array and updates local storage accordingly.
 */
function addTask(taskData, tasksContainer, tasksArr) {
	if (typeof taskData != 'object') {
		taskData = createTaskObj(getLastTaskId(tasksArr) + 1, taskData);
		tasksArr.push(taskData);
		setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	}
	const taskElem = createTaskElem(taskData.id, taskData.name, taskData.desc, taskData.createdAt);
	tasksContainer.insertAdjacentHTML('beforeend', taskElem);
	setCompleteTaskEvent(taskData, tasksContainer, tasksArr);
	resetInput(document.getElementById('taskInput'));
}

export { setCompleteTaskEvent, selectTask, createTaskObj, createTaskElem, updateTaskInDom, removeTask, addTask, getTaskId }
