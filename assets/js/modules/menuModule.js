/**
 * Toggle the visibility of the color selection menu.
 *
 * @function
 * @name toggleColorMenu
 *
 * @description Toggles the visibility of the color selection menu.
 */
function toggleColorMenu() {
	document.querySelector('.colorMenu').classList.toggle('show-menu');
}

/**
 * Toggle menu visibility by adding/removing CSS classes.
 *
 * @function
 * @name toggleMenuContent
 *
 * @param {Element} menuBtn - The menu button element.
 * @param {Element} menuContent - The menu content element.
 *
 * @description Toggles the visibility of the menu by adding/removing CSS classes.
 */
function toggleMenuContent(menuBtn, menuContent) {
	menuBtn.classList.toggle("menu-open");
	menuContent.classList.toggle('show-menu');
}

export { toggleColorMenu, toggleMenuContent };
