import { setToStorage, getStorageTaskIndex } from './storageModule.js';
import { addTask } from './taskModule.js';
import { getCurrentDate } from './utilitiesModule.js';
import { LOCAL_STORAGE_TASKS_KEY } from './constantsModule.js';

/**
 * Removes a completed task from the tasks array and updates local storage.
 *
 * @function
 * @name removeCompletedTask
 *
 * @param {Element} completedTaskElem - The completed task element to be removed.
 * @param {Array} tasksArr - The array containing the task data.
 *
 * @description
 * This function takes a completed task element as input, removes the task from the `tasks` array,
 * updates the local storage, and removes the task element from the DOM.
 */
function removeCompletedTask(completedTaskElem, tasksArr) {
	const index = getStorageTaskIndex(completedTaskElem.dataset.taskId, tasksArr);
	tasksArr.splice(index, 1);
	setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	completedTaskElem.remove();
}

/**
 * Undoes a completed task and moves it back to the active tasks list.
 *
 * @function
 * @name undoCompletedTask
 *
 * @param {Element} completedTaskElem - The completed task element to be undone.
 * @param {Element} tasksContainer - The container element for active tasks in the DOM.
 * @param {Array} tasksArr - The array containing the task data.
 *
 * @description
 * This function takes a completed task element as input, updates the task's status and completion timestamp
 * in the `tasks` array, updates the local storage, adds the task back to the active tasks list in the DOM,
 * and removes the completed task element from the DOM.
 */
function undoCompletedTask(completedTaskElem, tasksContainer, tasksArr) {
	const index = getStorageTaskIndex(completedTaskElem.dataset.taskId, tasksArr);
	const taskData = tasksArr.find(task => task.id === Number(completedTaskElem.dataset.taskId));
	tasksArr[index].status = false;
	delete tasksArr[index].completedAt;
	setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	addTask(taskData, tasksContainer, tasksArr);
	completedTaskElem.remove();
}

/**
 * Creates an HTML table row element to represent a completed task.
 *
 * @function
 * @name createCompletedTaskElem
 *
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} taskTitle - The title or name of the task.
 * @param {string} taskDesc - The description of the task.
 * @param {string} createdAt - The date when the task was created.
 * @param {string} completedAt - The date when the task was completed.
 *
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
 *
 * @function
 * @name markTaskAsCompleted
 *
 * @param {object} taskData - An object containing task details, including id, name, description, createdAt, and completedAt.
 * @param {boolean} storageTask - Indicates whether the task is stored in local storage. Default is false.
 * @param {Array} tasksArr - The array containing the task data.
 */
function markTaskAsCompleted(taskData, storageTask = false, tasksArr) {

	const index = getStorageTaskIndex(taskData.id, tasksArr);
	const taskElem = createCompletedTaskElem(
		taskData.id,
		taskData.name,
		taskData.desc,
		taskData.createdAt,
		taskData.completedAt || getCurrentDate()
	);
	if (!storageTask) {
		tasksArr[index].status = true;
		tasksArr[index].completedAt = getCurrentDate();
		setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	}
	const completedTasksTable = document.querySelector('table tbody');
	completedTasksTable.insertAdjacentHTML('beforeend', taskElem);
}

export { removeCompletedTask, undoCompletedTask, markTaskAsCompleted, createCompletedTaskElem };
