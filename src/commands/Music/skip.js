const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "skip",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Skips a track",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);

		if (!player) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		}
		if (!message.member.voice.channel) {
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
		} else {
			let autoplay = player.get("autoplay");
			if (autoplay === false) {
				player.stop();
			} else {
				player.stop();
				player.set("autoplay", false);
			}

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
