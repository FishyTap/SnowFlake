const { Client } = require("discord.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */

module.exports = client => {
	client?.manager?.init(client.user.id);

	console.log(
		chalk.bold.hex("#FF5555")("|") +
			" " +
			chalk.bold.white("[Client]") +
			" " +
			chalk.bold.hex("#00FFFF")(`${client.user.username} is Online!`)
	);

	setInterval(() => {
		const randomPresence = () => {
			let presence = [
				"/help",
				`${client.guilds.cache.size} Servers!`,
				"Music"
			];

			let index = Math.floor(Math.random() * presence.length);
			return `${presence[index]}`;
		};
		client.user.setActivity({
			name: randomPresence(),
			type: "LISTENING"
		});
	}, 1000 * 10);

	client.user.setPresence({
		status: "online"
	});
};
