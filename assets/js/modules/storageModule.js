import { LOCAL_STORAGE_TASKS_KEY } from "./constantsModule.js";
import { addTask } from "./taskModule.js";

/**
 * Sets data to local storage.
 *
 * @function
 * @name setToStorage
 *
 * @param {string} key - The key to store the data under.
 * @param {any} data - The data to be stored (in JSON-stringify form).
 *
 * @description Sets data to the local storage using the provided key.
 */
function setToStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieves data from local storage.
 *
 * @function
 * @name getFromStorage
 *
 * @param {string} key - The key to retrieve data from.
 * @param {boolean} json - Whether to parse the retrieved data as JSON.
 * @returns {any} - The retrieved data.
 *
 * @description Retrieves data from local storage based on the provided key.
 */
function getFromStorage(key, json = true) {
	const data = localStorage.getItem(key);
	return json ? JSON.parse(data) : data;
}

/**
 * Get the index of a task in an array based on its ID.
 *
 * @function
 * @name getStorageTaskIndex
 *
 * @param {number} id - The unique identifier of the task.
 * @param {Array} tasksArr - The array containing task data.
 * @returns {number} - The index of the task in the array.
 *
 * @description Finds the index of a task in an array based on its ID.
 */
function getStorageTaskIndex(id, tasksArr) {
	return tasksArr.findIndex(task => task.id === Number(id));
}

/**
 * Updates task data in storage based on the provided task data.
 *
 * @function
 * @name updateTaskInStorage
 *
 * @param {number} taskIndex - The updated task index in localStorage.
 * @param {Array} tasksArr - The array containing task data.
 * @param {object} newTaskData - The new changes of task in object form
 *
 * @description Updates task data in local storage based on the provided task data.
 */
function updateTaskInStorage(taskIndex, tasksArr, newTaskData) {
	if (taskIndex !== -1) {
		tasksArr[taskIndex].name = newTaskData.name;
		tasksArr[taskIndex].desc = newTaskData.desc;
		tasksArr[taskIndex].status = newTaskData.status;
		setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	}
}

/**
 * Load tasks from local storage and populate the task list.
 *
 * @function
 * @name loadStorageTasks
 *
 * @param {Array} taskArray - An array containing tasks retrieved from local storage.
 * @param {Element} tasksContainer - The container for displaying tasks in the DOM.
 *
 * @description Loads tasks from local storage and populates the task list in the DOM.
 */
function loadStorageTasks(taskArray, tasksContainer) {
	taskArray.forEach(taskData => addTask(taskData, tasksContainer, taskArray, taskData.status));
}

export { setToStorage, getFromStorage, getStorageTaskIndex, updateTaskInStorage, loadStorageTasks };