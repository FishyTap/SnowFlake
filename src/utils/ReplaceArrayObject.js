module.exports = {
	/**
	 *
	 * @param {[Object]} array
	 * @param {Object} key
	 * @param {Object} replaced
	 * @returns
	 */
	replaceArrayObject: (array, key, replaced) => {
		for (var i in array) {
			if (array[i] == key) {
				return (array[i] = replaced);
			}
		}
	}
};
