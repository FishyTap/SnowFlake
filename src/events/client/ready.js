const { Client } = require("discord.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */

module.exports = client => {
	client.guilds.cache.forEach(guild => {
		if (!guild.me.permissions.has("ADMINISTRATOR")) {
			return;
		}
		return guild;
	});

	client?.manager?.init(client.user.id);

	console.log(
		chalk.bold.hex("#FF5555")("|") +
			" " +
			chalk.bold.white("[Client]") +
			" " +
			chalk.bold.hex("#00FFFF")(`${client.user.username} is Online!`)
	);

	client.user.setPresence({
		status: "online"
	});

	client.user.setActivity({
		name: `/help`,
		type: "LISTENING"
	});
};
