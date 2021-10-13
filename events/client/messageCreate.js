const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const cooldown = new Map();
const { customPrefix } = require("../../mongo/functions/prefixes");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */

module.exports = async (client, message) => {
	let prefix = await customPrefix(message);

	client.prefix = prefix;

	const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

	if (message.content.match(mention)) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("🛡 **Who pinged me???**")
					.setDescription(
						`${[
							`**My current prefix in this guild is \`${prefix}\`**`,
							`**Use \`${prefix}help\` to attain more information!**`
						].join("\n")}`
					)
			]
		});
	}

	if (
		!message.content.startsWith(client.prefix) ||
		message.author.bot ||
		!message.guild
	)
		return;

	// Arguments
	const args = message.content.slice(client.prefix.length).split(/[ ]+/);
	const cmd = args.shift().toLowerCase();

	const command =
		client.commands.get(cmd) ||
		client.commands.find((col) => col.aliases && col.aliases.includes(cmd));

	if (!command) return;

	// Cooldown
	if (!cooldown.has(command.name)) {
		cooldown.set(command.name, new Collection());
	}

	const current_time = Date.now();
	const time_stamps = cooldown.get(command.name);
	const cooldown_amount = command.cooldown * 1000;

	if (time_stamps.has(message.author.id)) {
		const expiration_time =
			time_stamps.get(message.author.id) + cooldown_amount;
		if (current_time < expiration_time) {
			message.delete();

			const time_left = (expiration_time - current_time) / 1000;
			return message.channel
				.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**Please wait \`${time_left.toFixed(
									1
								)} seconds\` between each cooldown**`
							)
					]
				})
				.then((msg) => setTimeout(() => msg.delete(), 1000 * 5));
		}
	}
	time_stamps.set(message.author.id, current_time);

	setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

	// Permissions
	const permissionsFlags = [
		"CREATE_INSTANT_INVITE",
		"KICK_MEMBERS",
		"BAN_MEMBERS",
		"ADMINISTRATOR",
		"MANAGE_CHANNELS",
		"MANAGE_GUILD",
		"ADD_REACTIONS",
		"VIEW_AUDIT_LOG",
		"PRIORITY_SPEAKER",
		"STREAM",
		"VIEW_CHANNEL",
		"SEND_MESSAGES",
		"SEND_TTS_MESSAGES",
		"MANAGE_MESSAGES",
		"EMBED_LINKS",
		"ATTACH_FILES",
		"READ_MESSAGE_HISTORY",
		"MENTION_EVERYONE",
		"USE_EXTERNAL_EMOJIS",
		"VIEW_GUILD_INSIGHTS",
		"CONNECT",
		"SPEAK",
		"MUTE_MEMBERS",
		"DEAFEN_MEMBERS",
		"MOVE_MEMBERS",
		"USE_VAD",
		"CHANGE_NICKNAME",
		"MANAGE_NICKNAMES",
		"MANAGE_ROLES",
		"MANAGE_WEBHOOKS",
		"MANAGE_EMOJIS_AND_STICKERS",
		"USE_APPLICATION_COMMANDS",
		"REQUEST_TO_SPEAK",
		"MANAGE_THREADS",
		"USE_PUBLIC_THREADS",
		"USE_PRIVATE_THREADS",
		"USE_EXTERNAL_STICKERS"
	];

	if (command.permissions.length) {
		let invalidPermissionsFlags = [];

		for (const permission of command.permissions) {
			if (!permissionsFlags.includes(permission)) {
				return console.log(`Invalid Permission Node: "${permission}"`);
			}

			if (!message.member.permissions.has(permission)) {
				message.delete();
				invalidPermissionsFlags.push(permission);
			}
		}

		if (invalidPermissionsFlags.length) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You don't have the required permissions to use this command**`
						)
						.addField(
							"Required Permissions",
							`\`${invalidPermissionsFlags.join(", ")}\``
						)
				]
			});
		}
	}

	// Exporting the callbacks
	try {
		command.callbacks(client, message, args);
	} catch (err) {
		console.log(err);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.REDHEX)
					.setDescription("**An Error Occured**")
			]
		});
	}
};
