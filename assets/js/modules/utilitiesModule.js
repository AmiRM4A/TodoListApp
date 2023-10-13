/**
 * Gets the current date in the format MM/DD/YYYY.
 *
 * @function
 * @name getCurrentDate
 *
 * @returns {string} - The current date.
 *
 * @description Retrieves the current date in the MM/DD/YYYY format.
 */
function getCurrentDate() {
	const d = new Date();
	return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * Checks if an HTML element contains a specific CSS class.
 *
 * @function
 * @name hasClass
 *
 * @param {HTMLElement} element - The HTML element to check.
 * @param {string} className - The CSS class name to look for.
 * @returns {boolean} - `true` if the class is found; otherwise, `false`.
 *
 * @description Checks if the provided HTML element contains the specified CSS class.
 */
function hasClass(element, className) {
	return element.classList.contains(className);
}

/**
 * Resets the input field.
 *
 * @function
 * @name resetInput
 *
 * @param {HTMLElement} taskInput - The input field element to reset.
 *
 * @description Clears the value of the input field.
 */
function resetInput(taskInput) {
	taskInput.value = '';
}

/**
 * Toggles a CSS class on an HTML element.
 *
 * @function
 * @name toggleClass
 *
 * @param {HTMLElement} element - The HTML element to toggle the class on.
 * @param {string} className - The CSS class name to toggle.
 *
 * @description Toggles the specified CSS class on the provided HTML element.
 */
function toggleClass(element, className) {
	element.classList.toggle(className);
}

/**
 * Change the website's favicon to match a selected color theme.
 *
 * @function
 * @name changeFavIcon
 *
 * @param {string} newIconPath - The path to the new favicon.
 *
 * @description Updates the website's favicon to match a selected color theme.
 */
function changeFavIcon(newIconPath) {
	const favIcon = document.querySelector('#favIcon');
	favIcon.href = newIconPath;
}

/**
 * Change the website's logo to match a selected color theme.
 *
 * @function
 * @name changeLogo
 *
 * @param {string} newLogoPath - The path to the new logo image.
 *
 * @description Updates the website's logo to match a selected color theme.
 */
function changeLogo(newLogoPath) {
	const logo = document.querySelector('#logo');
	logo.src = newLogoPath;
}

function addClass(className, ...elements) {
	elements.forEach(elem => elem.classList.add(className));
}

function removeClass(className, ...elements) {
	elements.forEach(elem => elem.classList.remove(className));
}

function getParentElementByClassName(element, parentElementClassName) {
	let elem = element;
	while (!hasClass(elem, parentElementClassName)) {
		elem = elem.parentElement;
		if (elem.tagName === 'BODY') break;
	}
	return elem;
}

function swapTaskIconsTo(to = 'completed', taskElem) {
	const spanIconElem = taskElem.querySelector('.done-span');
	const btnIconElem = taskElem.querySelector('.done-btn');
	to === 'completed' ? (addClass('fa-undo', btnIconElem, spanIconElem), removeClass('fa-check', btnIconElem, spanIconElem)) : (addClass('fa-check', btnIconElem, spanIconElem), removeClass('fa-undo', btnIconElem, spanIconElem));
}


export { getCurrentDate, resetInput, hasClass, toggleClass, changeLogo, changeFavIcon, removeClass, addClass, getParentElementByClassName, swapTaskIconsTo };
