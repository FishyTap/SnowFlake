const { Client } = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

/**
 *
 * @param {Client} client
 */
module.exports = client => {
	let dir = "../../events/lavalink";

	fs.readdirSync(path.join(__dirname, dir))
		.filter(files => files.endsWith(".js"))
		.forEach(file => {
			try {
				let events = require(path.join(__dirname, dir, file));

				let name = file.split(".")[0];

				client?.manager?.on(name, events.bind(null, client));
				console.log(
					chalk.bold.hex(process.env.SIDEBARHEX)("|") +
						" " +
						chalk.bold.white("[Lavalink]") +
						" " +
						chalk.bold.hex(process.env.REDHEX)(`"${file}"`)
				);
			} catch (err) {
				console.log(err);
				console.log(
					chalk.bold.hex(process.env.SIDEBARHEX)("|") +
						" " +
						chalk.bold.hex(process.env.ERRORHEX)("[Lavalink]") +
						" " +
						chalk.bold.hex(process.env.ERRORHEX)(`"${file}"`)
				);
			}
		});
};
