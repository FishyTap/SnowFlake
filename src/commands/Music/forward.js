const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "forward",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<forwardTime>",
	description: "Forwards a specific amount of time into the track",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = message.client.manager.get(message.guild.id);

		if (!player) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		} else if (!message.member.voice.channel) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${message.client.user}**`
						)
				]
			});
		} else if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state time you want to seek to**"
						)
				]
			});
		} else {
			let time = 0;

			for (let i = 0; i < args.length; i++) {
				time += ms(args[i]);
			}

			const position = player.position;
			const duration = player.queue.current.duration;

			if (time <= duration) {
				player.seek(position + time);

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`⏩ **Track forwarded to  \`${pMs(
									player.position,
									{ compact: true }
								)}\`**`
							)
					]
				});
			} else {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Forward time exceeds the track duration**"
							)
					]
				});
			}
		}
	}
};
