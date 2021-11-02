const { Client } = require("discord.js");
const chalk = require("chalk");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
	const commands = await globPromise(
		`${process.cwd()}/src/interactions/**/**/*.js`
	);
	const cmdArray = [];

	commands.map((value) => {
		try {
			const file = require(value);
			console.log(
				chalk.bold.hex(process.env.SIDEBARHEX)("|") +
					" " +
					chalk.bold.white("[Interaction]") +
					" " +
					chalk.bold.hex(process.env.LIMEHEX)(
						`"${file.name + ".js"}"`
					)
			);

			if (!file.name) return;

			client.interactions.set(file.name, file);

			if (["MESSAGE", "USER"].includes(file.type)) {
				delete file.description;
			}

			if (file.permissions) file.defaultPermission = false;

			cmdArray.push(file);
		} catch (err) {
			console.log(err);
			const file = require(value);
			chalk.bold.hex(process.env.SIDEBARHEX)("|") +
				" " +
				chalk.bold.hex(process.env.ERRORHEX)("[Interaction]") +
				" " +
				chalk.bold.hex(process.env.ERRORHEX)(
					`Error: Failed to load "${file}"`
				);
		}
	});

	const servers = [
		"797709775898542110", // Main
		"882582756482252840", // Test
		"728751693503922190" // Dev
	];
	let { test } = require("../../index");

	client.on("ready", async () => {
		if (test == true) {
			servers.forEach(async (guilds) => {
				let guild = client.guilds.cache.get(guilds);

				await guild?.commands.set(cmdArray).then(async (cmd) => {
					const getRoles = (commandNames) => {
						const perms = cmdArray.find(
							(x) => x.name === commandNames
						).permissions;

						if (!perms) return null;
						return guild.roles.cache.filter(
							(x) => x.permissions.has(perms) && !x.managed
						);
					};

					const fullPermissions = cmd.reduce((accumulater, x) => {
						const roles = getRoles(x.name);
						if (!roles) return accumulater;

						const permissions = roles.reduce((a, v) => {
							return [
								...a,
								{
									id: v.id,
									type: "ROLE",
									permission: true
								}
							];
						}, []);

						return [
							...accumulater,
							{
								id: x.id,
								permissions
							}
						];
					}, []);

					guild?.commands.permissions.set({ fullPermissions });
				});
			});
		} else if (test == false) {
			await client.application?.commands
				.set(cmdArray)
				.then(async (cmd) => {
					client.guilds.cache.forEach(async (guild) => {
						const getRoles = (commandNames) => {
							const perms = cmdArray.find(
								(x) => x.name === commandNames
							).permissions;

							if (!perms) return null;
							return guild.roles.cache.filter(
								(x) => x.permissions.has(perms) && !x.managed
							);
						};

						const fullPermissions = cmd.reduce((accumulater, x) => {
							const roles = getRoles(x.name);
							if (!roles) return accumulater;

							const permissions = roles.reduce((a, v) => {
								return [
									...a,
									{
										id: v.id,
										type: "ROLE",
										permission: true
									}
								];
							}, []);

							return [
								...accumulater,
								{
									id: x.id,
									permissions
								}
							];
						}, []);

						guild.commands.permissions.set({ fullPermissions });
					});
				});
		}
	});
};
