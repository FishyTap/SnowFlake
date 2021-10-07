const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "autoplay",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Toggles autoplay",
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
		} else if (!player.queue.current) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**No tracks are currently being played**"
						)
				]
			});
		} else {
			const autoplay = player.get("autoplay");

			if (autoplay === false) {
				const identifier = player.queue.current.identifier;

				player.set("autoplay", true);
				player.set("requester", message.author);
				player.set("identifier", identifier);

				const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
				let res = await player.search(search, message.author);

				player.queue.add(res.tracks[1]);

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**↪️ Autoplay is now \`enabled\`**`
							)
					]
				});
			} else {
				player.set("autoplay", false);
				player.queue.clear();

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**↪️ Autoplay is now \`disabled\`**`
							)
					]
				});
			}
		}
	}
};
