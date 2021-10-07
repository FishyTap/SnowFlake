const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "mute",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_MESSAGES"],
	usage: "<user> <optional: time>",
	description: "Mutes a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let target = message.mentions.members.first();

		if (!target)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription("**You must state a user to mute**")
				]
			});

		let muteRole = message.guild.roles.cache.find(
			(role) => role.name === "Muted"
		);

		if (!args[1]) {
			target.roles.add(muteRole);

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Successfully muted ${target}**`)
				]
			});
		} else {
			target.roles.add(muteRole);

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**Successfully muted ${target} for \`${pMs(
								ms(args[1]),
								{ verbose: true }
							)}\`**`
						)
				]
			});

			setTimeout(() => {
				target.roles.remove(muteRole);

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**Successfully unmuted ${target}**`
							)
					]
				});
			}, ms(args[1]));
		}
	}
};
