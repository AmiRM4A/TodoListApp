const $ = document;
const todoInput = $.querySelector('.todo-input');
const addTaskBtn = $.querySelector('.todo-btn');
const tasksCon = $.querySelector('.todo');
const menuBg = $.querySelector('.menu-bg');
const closeBgBtn = $.querySelector('.menu-bg .fa-times');
const menuBtn = $.querySelector(".menu-btn");
const editTaskModal = $.querySelector('#editTaskModal');

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
	return { id: getLastId() + 1, name: taskName, desc: '', createdAt: getCurrentDate(), status: false }
}

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

function resetInput() {
	todoInput.value = '';
}

function selectTask(taskId) {
	return tasksCon.querySelector(`[data-task-id = "${taskId}"]`) || null;
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

function removeTaskHandler(taskElem) {
	removeTask(taskElem);
}

function showModal(modalElem) {
	const modalDisplay = getComputedStyle(modalElem).display;
	if (!modalDisplay) return;
	modalElem.style.display = (modalDisplay == 'none') ? 'block' : 'none';
}

function toggleEditModal() {
	showModal(editTaskModal);
}

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

function editTaskHandler(taskElem) {
	fillModalInput(taskElem);
	toggleEditModal();
}

function toggleMenu() {
	menuBtn.classList.toggle("menu-open");
	menuBg.classList.toggle('show-menu-bg');
}

function taskConHandler() {
	event.preventDefault();
	const taskElem = event.target.parentElement.parentElement;
	if (event.target.classList.contains('fa-times')) removeTaskHandler(taskElem);
	if (event.target.classList.contains('fa-edit')) editTaskHandler(taskElem);
}

function updateStorageTask(taskData) {
	const index = tasks.findIndex(task => Number(task.id) === Number(taskData.id));
	if (index != -1) {
		tasks[index].name = taskData.name;
		tasks[index].desc = taskData.desc;
		tasks[index].status = taskData.status;
		setToStorage('tasks', tasks);
	}
}

function updateTask(taskData) {
	const taskElem = selectTask(Number(taskData.id));
	if (taskElem != null) {
		taskElem.querySelector('.task-title').textContent = taskData.name;
		taskElem.querySelector('.task-desc').textContent = taskData.desc;
	}
}

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

function menuBgHandler() {
	if (event.target.classList.contains('fa-times')) toggleMenu();
}

function resetModal() {
	const taskId = Number(editTaskModal.querySelector('.task-id').value);
	const taskData = tasks.find(task => task.id === taskId);
	if (taskData) {
		fillModalInput()
	}
}


function editTaskModalHandler() {
	if (event.target.classList.contains('close-button')) toggleEditModal();
	if (event.target.classList.contains('save-modal')) saveModalHandler();
}

window.addEventListener('load', initialize);
addTaskBtn.addEventListener('click', addTodoHandler);
tasksCon.addEventListener('click', taskConHandler);
menuBg.addEventListener('click', menuBgHandler);
menuBtn.addEventListener("click", toggleMenu);
editTaskModal.addEventListener('click', editTaskModalHandler);