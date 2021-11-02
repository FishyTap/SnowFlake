const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "unmute",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_MESSAGES"],
	usage: "<user>",
	description: "Unmutes a user",
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

		target.roles.remove(muteRole);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(`**Successfully unmuted ${target}**`)
			]
		});
	}
};
