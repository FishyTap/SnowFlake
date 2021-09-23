const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Pagination } = require("../../../utils/Pagination");

module.exports = {
	name: "queue",
	description: "Shows the queue",
	type: "CHAT_INPUT",
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	callbacks: async (client, interaction, args) => {
		await interaction.deferReply({
			ephemeral: false
		});

		const player = client.manager.players.get(interaction.guildId);

		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if (!player) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		}
		if (!voiceChannel) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			voiceChannel !== interaction.guild.me.voice.channel
		) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${interaction.client.user}**`
						)
				]
			});
		} else if (!player.queue.size) {
			return interaction.editReply({
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
			Pagination(
				interaction,
				pages,
				null,
				60000,
				[true, true],
				"interaction"
			);
		}
	}
};
