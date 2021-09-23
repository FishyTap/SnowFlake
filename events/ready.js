const { Client } = require("discord.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
	console.log(
		chalk.bold.hex("#FF5555")("|") +
			" " +
			chalk.bold.white("[Client]") +
			" " +
			chalk.bold.hex("#00FFFF")(`${client.user.username} is Online!`)
	);
	// setInterval(async () => {
	//     const stats = [
	//         "dnd",
	//         "idle",
	//         "invisible",
	//         "online"
	//     ];

	// let randomStatus = Math.floor(Math.random() * stats.length);
	// let status = stats[randomStatus];

	client.user.setPresence({
		status: "online" // status,
	});

	client.user.setActivity({
		name: `${process.env.PREFIX}help`,
		type: "LISTENING"
	});
	// }, 1000 * 15);
};
