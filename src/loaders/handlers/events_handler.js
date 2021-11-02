const { Client } = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const dir = "../../events/client";

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
	fs.readdirSync(path.join(__dirname, dir))
		.filter((files) => files.endsWith(".js"))
		.forEach((file) => {
			try {
				const events = require(path.join(__dirname, dir, file));
				const name = file.split(".")[0];

				client.on(name, events.bind(null, client));
				console.log(
					chalk.bold.hex(process.env.SIDEBARHEX)("|") +
						" " +
						chalk.bold.white("[Events]") +
						" " +
						chalk.bold.hex(process.env.ORANGEHEX)(`"${file}"`)
				);
			} catch (err) {
				console.log(err);
				console.log(
					chalk.bold.hex(process.env.SIDEBARHEX)("|") +
						" " +
						chalk.bold.hex(process.env.ERRORHEX)("[Events]") +
						" " +
						chalk.bold.hex(process.env.ERRORHEX)(
							`Error: Failed to load "${file}"`
						)
				);
			}
		});
};
