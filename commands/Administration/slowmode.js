const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "slowmode",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_CHANNELS"],
	usage: "<time> <channel>",
	description: "Changes the slowmode time in a specific channel",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const channel = message.channel;
		let time = args[0];

		if (!time) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state a new slowmode time**"
						)
				]
			});
		}

		let raw = ms(time);

		if (isNaN(raw)) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Invalid Value**")
				]
			});
		}

		if (raw < 0) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**Slowmode time can't be lower than \`${pMs(0, {
								verbose: true
							})}\`**`
						)
				]
			});
		}

		if (raw > 21600000) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**Slowmode time can't be higher than \`${pMs(
								21600000,
								{ verbose: true }
							)}\`**`
						)
				]
			});
		}

		channel.setRateLimitPerUser(raw / 1000);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						`**The slowmode for this channel has been changed to \`${pMs(
							raw,
							{ verbose: true }
						)}\`**`
					)
			]
		});
	}
};
