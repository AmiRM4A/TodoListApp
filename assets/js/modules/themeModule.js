import { changeFavIcon, changeLogo } from "./utilitiesModule.js";
import { ICONS_PATH, LOGOS_PATH } from "./constantsModule.js";

const colors = {
	'rgb(187, 134, 252)': 'pink',
	'rgb(0, 191, 165)': 'teal',
	'rgb(61, 90, 254)': 'indigo',
	'rgb(255, 82, 82)': 'red',
	'rgb(100, 221, 23)': 'green'
};

/**
 * Retrieve the name of a color based on its code.
 *
 * @function
 * @name getColorName
 *
 * @param {string} color - The code or name of the color.
 * @returns {string} The name of the color.
 *
 * @description Retrieves the name of a color based on its code or name.
 */
function getColorName(color) {
	return colors[color];
}

/**
 * Select a color theme and update the website's appearance.
 *
 * @function
 * @name selectThemeColor
 *
 * @param {string} color - The primary color code of the selected theme.
 *
 * @description Selects a color theme and updates the website's appearance, including favicon, logo, and theme color.
 */
function selectThemeColor(color) {
	const colorName = getColorName(color);
	changeFavIcon(`${ICONS_PATH}fav-${colorName}.png`);
	changeLogo(`${LOGOS_PATH}logo-${colorName}.png`);
	document.documentElement.style.setProperty('--theme-color', color);
}

export { selectThemeColor };
