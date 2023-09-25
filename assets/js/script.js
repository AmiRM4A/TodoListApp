const $ = document;
const todoInput = $.querySelector('.todo-input');
const addTaskBtn = $.querySelector('.todo-btn');
const tasksCon = $.querySelector('.todo');

let tasks;

function setToStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, json = true) {
	const data = localStorage.getItem(key);
	return json ? JSON.parse(data) : data;
}

function initialize() {
	const storageData = getFromStorage('tasks', true);
	if (storageData == null || typeof storageData != 'object') {
		tasks = [];
		return;
	}
	tasks = storageData;
	tasks.forEach(task => addTask(task));
}

function getLastId() {
	if (tasks.length < 1) return 0;
	let lastId = 0;
	tasks.forEach(task => {
		if (task.id > lastId) lastId = task.id;
	});
	return lastId;
}
function getCurrentDate() {
	const d = new Date();
	return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

function createTaskObj(taskName) {
	return { id: getLastId() + 1, name: taskName, createdAt: getCurrentDate(), status: false }
}

function createTaskElem(taskData) {
	return `
        <div class="task" data-task-id=${taskData.id}>
          <a href="">
            <span class="fas fa-times"></span>
            <div class="task-info">
              <div class="task-title">${taskData.name}</div>
              <div class="task-desc">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
              </div>
            </div>
            <span class="fas fa-info-circle"></span>
			Created:
			<span style="color: #bb86fc;"> ${taskData.createdAt} </span>
          </a>
        </div>
	`;
}

function resetInput() {
	todoInput.value = '';
}

function selectTask(taskId) {

}

function getTaskId(taskElem) {
	return Number(taskElem.dataset.taskId);
}

function removeTaskElem(taskElem) {
	taskElem.remove();
}

function removeTask(taskElem) {
	const taskElemId = getTaskId(taskElem);
	const index = tasks.findIndex(taskObj => taskObj.id == taskElemId);
	tasks.splice(index, 1);
	setToStorage('tasks', tasks);
	removeTaskElem(taskElem);
}

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

function addTodoHandler() {
	const taskName = todoInput.value;
	if (!taskName) return;
	addTask(taskName);
}

function removeTaskHandler() {
	const taskElem = event.target.parentElement.parentElement;
	removeTask(taskElem);
}

function taskConHandler() {
	if (event.target.classList.contains('fa-times')) {
		removeTaskHandler();
	}
}

window.addEventListener('load', initialize);
addTaskBtn.addEventListener('click', addTodoHandler);
tasksCon.addEventListener('click', taskConHandler);
