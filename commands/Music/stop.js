const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "stop",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Stops the client from playing anymore tracks",
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
		} else {
			let autoplay = player.get("autoplay");
			if (autoplay === true) {
				player.set("autoplay", false);
			}

			player.destroy();
			player.queue.clear();
			player.disconnect();

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`⏹️ **Track Stopped**`)
				]
			});
		}
	}
};
