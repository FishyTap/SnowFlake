const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "skipto",
	description: "Skips to a specific track",
	type: "CHAT_INPUT",
	options: [
		{
			name: "index",
			description: "index of the track you want to skip to",
			type: "NUMBER"
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

		let index = interaction.options.getNumber("index");

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
		} else if (!player.queue.current) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**No tracks are currently being played**`
						)
				]
			});
		} else {
			let i = Number(index);

			if (i > player.queue.size) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**There aren't that many tracks in the queue**`
							)
					]
				});
			} else if (i < 1) {
				return interaction.editReply({
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

			player.queue.remove(0, i - 1);
			player.stop();

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`⏭️ **Track Skipped**`)
				]
			});
		}
	}
};
