const {
	Client,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { capitalizeFirstLetter } = require("../../utils/CapitalizeFirstLetter");

module.exports = {
	name: "help",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none/command>",
	description:
		"Displays the help panel or shows the datails of a specific command",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let categoryEmojis = new Object();

		categoryEmojis = {
			ADMINISTRATION: "🔒",
			DEVELOPER: "🌐",
			FUN: "🎮",
			INFORMATION: "🔎",
			MUSIC: "🎧",
			UTILITIES: "⚙"
		};

		if (!args[0]) {
			let categories = [];

			fs.readdirSync(
				path.join(__dirname, "..", "..", "commands")
			).forEach((dir) => {
				if (
					dir == "Developer" &&
					message.author.id !== "835037519786803251"
				)
					return;
				let data = new Object();

				data = {
					name: `**${
						categoryEmojis[dir.toUpperCase()]
					} ${capitalizeFirstLetter(dir.toLowerCase())}**`,
					value: `\`\`\`${
						client.prefix
					}help ${dir.toLowerCase()}\`\`\``,
					inline: true
				};

				categories.push(data);
			});

			let row = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel("Invite")
					.setStyle("LINK")
					.setURL(
						`https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`
					)
			);

			let embed = new MessageEmbed()
				.setColor(process.env.SIGHEX)
				.setTitle("📫 **Need help?**")
				.setDescription(
					`${[
						`**SnowFlake is a Multi-Purpose bot with many Accessibilities and Features!**`,
						`\u200b`,
						`**My current prefix in this guild is \`${client.prefix}\`**`,
						`**Use \`${client.prefix}help\` followed by a command or category name to get more information about it**`
					].join("\n")}`
				)
				.addFields(categories)
				.addFields({
					name: "🏷 Soon",
					value: "```...```",
					inline: true
				});

			message.channel.send({
				embeds: [embed],
				components: [row]
			});
		} else {
			let dirs = [];
			let commands = [];

			fs.readdirSync(
				path.join(__dirname, "..", "..", "commands")
			).forEach((dir) => {
				if (
					dir == "Developer" &&
					message.author.id !== "835037519786803251"
				)
					return;
				dirs.push(`${dir.toLowerCase()}`);

				const cmd = fs
					.readdirSync(
						path.join(__dirname, "..", "..", "commands", dir)
					)
					.filter((files) => files.endsWith(".js"));

				const cmds = cmd.map((command) => {
					let file = require(path.join(
						__dirname,
						"..",
						"..",
						"commands",
						dir,
						command
					));

					if (!file.name) return "No name provided";

					let name = file.name.replace(".js", "");

					return `\`${name}\``;
				});

				let desc = new Object();

				desc = {
					ADMINISTRATION:
						"These are the Administration commands. Only the staffs can use these commands regarding their permissions!",
					DEVELOPER:
						"These are the Developer commands. Only the developers can use these commands!",
					FUN: "These are the Fun commands. You can play games and have fun with your friends!",
					INFORMATION:
						"These are the Information commands. You can use these commands to get information that you are looking for!",
					MUSIC: "These are the Music commands. You can play any song or playlist that you want!",
					UTILITIES:
						"These are the Utilities commands. Some of the commands requires you to have certain permissions before using!"
				};

				let data = new Object();

				data = {
					name: `${capitalizeFirstLetter(dir.toLowerCase())}`,
					value: cmds.length === 0 ? "NONE" : cmds.join(" "),
					emoji: `${categoryEmojis[dir.toUpperCase()]}`,
					description: desc[dir.toUpperCase()]
						? `${desc[dir.toUpperCase()]}`
						: "NONE",
					size: cmd.length
				};

				commands.push(data);
			});

			if (dirs.includes(args[0].toLowerCase())) {
				let index = dirs.indexOf(args[0].toLowerCase());
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle(
								`${commands[index].emoji} __**${commands[index].name} Commands**__`
							)
							.setDescription(`${commands[index].description}`)
							.addFields({
								name: `Commands [${commands[index].size}]`,
								value: commands[index].value
							})
					]
				});
			} else {
				const command =
					client.commands.get(args[0].toLowerCase()) ||
					client.commands.find(
						(col) =>
							col.aliases &&
							col.aliases.includes(args[0].toLowerCase())
					);

				if (!command) {
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(`**Unknown Query**`)
						]
					});
				}

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle(
								`__**${capitalizeFirstLetter(
									command.name
								)} Command**__`
							)
							.addField(
								"**COMMAND:**",
								command.name
									? `**\`${command.name}\`**`
									: "**`No name for this command`**",
								true
							)
							.addField(
								"**ALIASES:**",
								!command.aliases.length <= 0
									? `**\`${command.aliases.join("` `")}\`**`
									: "**`No aliases for this command`**",
								true
							)
							.addField(
								"**USAGE:**",
								command.usage
									? `**\`${client.prefix}${command.name} ${command.usage}\`**`
									: `**\`${client.prefix}${command.name}\`**`,
								true
							)
							.addField(
								"**COOLDOWN:**",
								command.cooldown
									? `**\`${command.cooldown} seconds\`**`
									: `**\`0 seconds\`**`,
								true
							)
							.addField(
								"**PERMISSIONS:**",
								!command.permissions.length <= 0
									? `**\`${command.permissions.join(
											"` `"
									  )}\`**`
									: "**`None`**",
								true
							)
							.addField(
								"**DESCRIPTION:**",
								command.description
									? `**\`${command.description}\`**`
									: "**`No description for this command`**",
								true
							)
					]
				});
			}
		}
	}
};
