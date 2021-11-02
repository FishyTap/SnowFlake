module.exports = {
	/**
	 *
	 * @param {String} string
	 * @returns
	 */
	capitalizeFirstLetter: async (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
};
