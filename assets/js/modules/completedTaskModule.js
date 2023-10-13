import { setToStorage, getStorageTaskIndex } from './storageModule.js';
import { getCurrentDate, addClass, removeClass, swapTaskIconsTo } from './utilitiesModule.js';
import { LOCAL_STORAGE_TASKS_KEY } from './constantsModule.js';

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
function undoCompletedTask(completedTaskElem, tasksArr) {
	// change the status of task to uncompleted in storage
	const index = getStorageTaskIndex(completedTaskElem.dataset.taskId, tasksArr);
	tasksArr[index]['status'] = false;
	delete tasksArr[index]['completedAt'];
	setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);

	// change the UI status of task to uncompleted in page
	removeClass('doneTask', completedTaskElem);
	swapTaskIconsTo('uncompleted', completedTaskElem);
	completedTaskElem.querySelector('.task-info').innerHTML = `
	<i class="fas fa-info-circle"></i>
        Created:
    <span style="color: var(--theme-color);"> ${tasksArr[index]['createdAt']} </span>
	`;
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
function markTaskAsCompleted(taskElem, taskData, tasksArr, fromStorage = false) {
	// change the status of task to completed in storage (if it wasn't from storage)
	if (!fromStorage) {
		const index = tasksArr.findIndex(task => task.id === taskData.id);
		tasksArr[index].status = true;
		tasksArr[index].completedAt = getCurrentDate();
		setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	}
	// change the status of task to completed in page
	addClass('doneTask', taskElem);
	swapTaskIconsTo('completed', taskElem);
	taskElem.querySelector('.task-info').innerHTML = `
	<i class="fa-solid fa-circle-check"></i>
        Completed:
    <span style="color: var(--theme-color);"> ${taskData.completedAt || tasksArr[index].completedAt} </span>
	`;
}

export { undoCompletedTask, markTaskAsCompleted, createCompletedTaskElem };


//todo:: work on clean code of the project then do items in .todo file and after that merge it with main branch, also use webStorm app for find some other problems too