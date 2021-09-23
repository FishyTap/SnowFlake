const { Client, Message, MessageEmbed } = require("discord.js");
const { Pagination } = require("../../utils/Pagination");

module.exports = {
	name: "queue",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Shows the queue",
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
		} else if (!player.queue.size) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**The queue is currently empty**`)
				]
			});
		} else if (player && player.queue.current) {
			let pages = [];
			let counter = 0;

			for (let i = 0; i < player.queue.size; i += 10) {
				if (counter >= 10) break;
				let k = player.queue;
				let tracks = k.slice(i, i + 10);

				let embed = new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("🎬  **Queue**  🎬").setDescription(`
                        **Now Playing**
                        **[${player.queue.current.title}](${
					player.queue.current.uri
				})**
                        ---------------------------------------------------------------------------------
                        ${tracks
							.map(
								(track, index) =>
									`**${index + 1 + counter * 10}.** **[${
										track.title
									}](${track.uri})**`
							)
							.join("\n")}
                    `);

				counter++;
				pages.push(embed);
			}
			Pagination(message, pages, null, 60000, [true, true]);
		}
	}
};
