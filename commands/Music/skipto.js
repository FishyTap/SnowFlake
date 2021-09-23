const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "skipto",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<index>",
	description: "Skips to a specified track",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = client.manager.players.get(message.guild.id);

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
		} else if (!player.queue.current) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**No tracks are currently being played**`
						)
				]
			});
		} else if (!args[0]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**You must state a track to skip to**`)
				]
			});
		} else if (isNaN(args[0])) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**Invalid Index**`)
				]
			});
		} else {
			let index = Number(args[0]);

			if (index > player.queue.size) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**There aren't that many tracks in the queue**`
							)
					]
				});
			} else if (index < 1) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**You can't skipto a currently playing track**`
							)
					]
				});
			}

			let autoplay = player.get("autoplay");
			if (autoplay === false) {
				player.stop();
			} else {
				player.stop();
				player.set("autoplay", false);
			}

			player.queue.remove(0, index - 1);
			player.stop();

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`⏭️ **Track Skipped**`)
				]
			});
		}
	}
};
