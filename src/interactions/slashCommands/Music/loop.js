const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "loop",
	description: "Loops the track or queue",
	type: "CHAT_INPUT",
	options: [
		{
			name: "mode",
			description: "looping modes",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "off",
					value: "off"
				},
				{
					name: "track",
					value: "track"
				},
				{
					name: "queue",
					value: "queue"
				}
			]
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

		let mode = interaction.options.getString("mode");

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
			let loopState;

			if (mode === "off") loopState = "0";
			if (mode === "track") loopState = "1";
			if (mode === "queue") loopState = "2";

			loopState = Number(loopState);

			loopOptions = {
				0: "off",
				1: "track",
				2: "queue"
			};

			if (loopState === 0) {
				if (player.queueRepeat) {
					player.setQueueRepeat(false);
				} else if (player.trackRepeat) {
					player.setTrackRepeat(false);
				}
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔁 **Loop is now set to \`${loopOptions[loopState]}\`**`
							)
					]
				});
			} else if (loopState === 1) {
				if (player.trackRepeat) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									`**Track is already looping on ${loopOptions[loopState]}**`
								)
						]
					});
				}

				player.setTrackRepeat(true);
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔁 **Loop is now set to \`${loopOptions[loopState]}\`**`
							)
					]
				});
			} else if (loopState === 2) {
				if (player.queueRepeat) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									`**Queue is already looping on ${loopOptions[loopState]}**`
								)
						]
					});
				}

				player.setQueueRepeat(true);
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔁 **Loop is now set to \`${loopOptions[loopState]}\`**`
							)
					]
				});
			}
		}
	}
};
