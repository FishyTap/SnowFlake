const { Client } = require("discord.js");
const { Node } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Node} node
 */

module.exports = (client, node) => {
	console.log(
		chalk.bold.hex("#FF5555")("|") +
			" " +
			chalk.bold.white("[Lavalink]") +
			" " +
			chalk.bold.hex("#FF392E")(
				`Connected to Node "${node.options.identifier}"`
			)
	);
};
