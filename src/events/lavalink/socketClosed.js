const { Client } = require("discord.js");
const { Player } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Player} player
 * @param {*} payload
 */

module.exports = async (client, player, payload) => {
	if (payload.byRemote == true) {
		player.destroy();
	}
	console.log(chalk.bold.red(`Socket closed due to ${payload.reason}`));
};
