const { Emoji } = require("discord.js");

const k = Emoji || String;

module.exports = {
	/**
	 *
	 * @param {String} total
	 * @param {String} current
	 * @param {String} size
	 * @param {k} line
	 * @param {k} slider
	 * @returns
	 */
	progressbar: (total, current, size, line, slider) => {
		if (current > total) {
			const bar = line.repeat(size + 2);
			return bar;
		} else {
			const percentage = current / total;
			const progress = Math.round(size * percentage);
			const emptyProgress = size - progress;
			const progressText = line.repeat(progress).replace(/.$/, slider);
			const emptyProgressText = line.repeat(emptyProgress);
			const bar = progressText + emptyProgressText;
			return bar;
		}
	}
};
