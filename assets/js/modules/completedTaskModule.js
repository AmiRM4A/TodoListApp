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
 * @param {Array} tasksArr - The array containing the task data.
 *
 * @description
 * This function takes a completed task element as input, updates the task's status and completion timestamp
 * in the `tasks` array, updates the local storage, adds the task back to the active tasks list in the DOM,
 * and removes the completed task element from the DOM.
 */
function undoCompletedTask(completedTaskElem, tasksArr) {
	// Change the status of task to uncompleted in storage
	const index = getStorageTaskIndex(Number(completedTaskElem.dataset.taskId), tasksArr);
	tasksArr[index]['status'] = false;
	delete tasksArr[index]['completedAt'];
	setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);

	// Change the UI status of task to uncompleted in page
	removeClass('doneTask', completedTaskElem);
	removeClass('strike', completedTaskElem.querySelector('.task-title'), completedTaskElem.querySelector('.task-desc'));
	swapTaskIconsTo('uncompleted', completedTaskElem);
	completedTaskElem.querySelector('.task-info').innerHTML = `
	<i class="fas fa-info-circle"></i>
        Created:
    <span style="color: var(--theme-color);"> ${tasksArr[index]['createdAt']} </span>
	`;
}

/**
 * Marks a task as completed and updates the task list. Optionally adds it to the completed tasks table.
 *
 * @function
 * @name markTaskAsCompleted
 *
 * @param {Element} taskElem - The element of the task you want to mark it as completed or done.
 * @param {object} taskData - An object containing task details, including id, name, description, createdAt, and completedAt.
 * @param {Array} tasksArr - The array containing the task data.
 * @param {boolean} fromStorage - Indicates whether the task is stored in local storage. Default is false.
 */
function markTaskAsCompleted(taskElem, taskData, tasksArr, fromStorage = false) {
	// Change the status of task to completed in storage (if it wasn't from storage)
	const index = tasksArr.findIndex(task => task.id === taskData.id);
	if (!fromStorage) {
		tasksArr[index].status = true;
		tasksArr[index].completedAt = getCurrentDate();
		setToStorage(LOCAL_STORAGE_TASKS_KEY, tasksArr);
	}

	// Change the status of task to completed in page
	addClass('doneTask', taskElem);
	addClass('strike', taskElem.querySelector('.task-title'), taskElem.querySelector('.task-desc'));
	swapTaskIconsTo('completed', taskElem);
	taskElem.querySelector('.task-info').innerHTML = `
	<i class="fa-solid fa-circle-check"></i>
        Completed:
    <span style="color: var(--theme-color);"> ${(fromStorage) ? tasksArr[index].completedAt : taskData.completedAt} </span>
	`;
}

export { undoCompletedTask, markTaskAsCompleted };