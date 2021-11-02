const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "seek",
	description: "Seeks to a specific time in the track",
	type: "CHAT_INPUT",
	options: [
		{
			name: "time",
			description: "seekTime",
			type: "STRING",
			required: true
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let time = interaction.options.getString("time");

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
		} else {
			let arg = time.split(/[ ]+/);

			let t = 0;

			for (let i = 0; i < arg.length; i++) {
				t += ms(arg[i]);
			}

			const position = player.position;
			const duration = player.queue.current.duration;

			if (t <= duration) {
				if (t > position) {
					player.seek(t);

					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`⏩ **Track seeked to  \`${pMs(
										player.position,
										{ verbose: true }
									)}\`**`
								)
						]
					});
				} else {
					player.seek(t);

					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`⏪ **Track seeked to  \`${pMs(
										player.position,
										{ verbose: true }
									)}\`**`
								)
						]
					});
				}
			} else {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**The duration of the current track isn't that long**"
							)
					]
				});
			}
		}
	}
};
