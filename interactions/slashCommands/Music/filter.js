const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "filter",
	description: "Sets the filter/equalizer",
	type: "CHAT_INPUT",
	options: [
		{
			name: "equalizer",
			description: "the filter you want to change to",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "party",
					value: "party"
				},
				{
					name: "bass",
					value: "bass"
				},
				{
					name: "radio",
					value: "radio"
				},
				{
					name: "pop",
					value: "pop"
				},
				{
					name: "trablebass",
					value: "trablebass"
				},
				{
					name: "soft",
					value: "soft"
				},
				{
					name: "none",
					value: "none"
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

		let equalizer = interaction.options.getString("equalizer");
		var player = interaction.client.manager.get(interaction.guild.id);

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
		} else if (!voiceChannel) {
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
			let thing = new MessageEmbed();

			if (equalizer == "none") {
				thing
					.setDescription("**The filter is now set to `none`**")
					.setColor(process.env.SIGHEX);
				player.clearEQ();
			} else if (equalizer == "party") {
				var bands = [
					{ band: 0, gain: -1.16 },
					{ band: 1, gain: 0.28 },
					{ band: 2, gain: 0.42 },
					{ band: 3, gain: 0.5 },
					{ band: 4, gain: 0.36 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: -0.3 },
					{ band: 7, gain: -0.21 },
					{ band: 8, gain: -0.21 }
				];
				thing
					.setDescription("**The filter is now set to `party`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "party";
			} else if (equalizer == "bass") {
				var bands = [
					{ band: 0, gain: 0.6 },
					{ band: 1, gain: 0.7 },
					{ band: 2, gain: 0.8 },
					{ band: 3, gain: 0.55 },
					{ band: 4, gain: 0.25 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: -0.25 },
					{ band: 7, gain: -0.45 },
					{ band: 8, gain: -0.55 },
					{ band: 9, gain: -0.7 },
					{ band: 10, gain: -0.3 },
					{ band: 11, gain: -0.25 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `bass`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "bass";
			} else if (equalizer == "radio") {
				var bands = [
					{ band: 0, gain: 0.65 },
					{ band: 1, gain: 0.45 },
					{ band: 2, gain: -0.45 },
					{ band: 3, gain: -0.65 },
					{ band: 4, gain: -0.35 },
					{ band: 5, gain: 0.45 },
					{ band: 6, gain: 0.55 },
					{ band: 7, gain: 0.6 },
					{ band: 8, gain: 0.6 },
					{ band: 9, gain: 0.6 },
					{ band: 10, gain: 0 },
					{ band: 11, gain: 0 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `radio`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "radio";
			} else if (equalizer == "pop") {
				var bands = [
					{ band: 0, gain: -0.25 },
					{ band: 1, gain: 0.48 },
					{ band: 2, gain: 0.59 },
					{ band: 3, gain: 0.72 },
					{ band: 4, gain: 0.56 },
					{ band: 5, gain: 0.15 },
					{ band: 6, gain: -0.24 },
					{ band: 7, gain: -0.24 },
					{ band: 8, gain: -0.16 },
					{ band: 9, gain: -0.16 },
					{ band: 10, gain: 0 },
					{ band: 11, gain: 0 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `pop`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "pop";
			} else if (equalizer == "trablebass") {
				var bands = [
					{ band: 0, gain: 0.6 },
					{ band: 1, gain: 0.67 },
					{ band: 2, gain: 0.67 },
					{ band: 3, gain: 0 },
					{ band: 4, gain: -0.5 },
					{ band: 5, gain: 0.15 },
					{ band: 6, gain: -0.45 },
					{ band: 7, gain: 0.23 },
					{ band: 8, gain: 0.35 },
					{ band: 9, gain: 0.45 },
					{ band: 10, gain: 0.55 },
					{ band: 11, gain: 0.6 },
					{ band: 12, gain: 0.55 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `trablebass`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "trablebass";
			} else if (equalizer == "bassboost") {
				var bands = new Array(7)
					.fill(null)
					.map((_, i) => ({ band: i, gain: 0.25 }));
				thing
					.setDescription("**The filter is now set to `bassboost`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "bassboost";
			} else if (equalizer == "soft") {
				var bands = [
					{ band: 0, gain: 0 },
					{ band: 1, gain: 0 },
					{ band: 2, gain: 0 },
					{ band: 3, gain: 0 },
					{ band: 4, gain: 0 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: 0 },
					{ band: 7, gain: 0 },
					{ band: 8, gain: -0.25 },
					{ band: 9, gain: -0.25 },
					{ band: 10, gain: -0.25 },
					{ band: 11, gain: -0.25 },
					{ band: 12, gain: -0.25 },
					{ band: 13, gain: -0.25 },
					{ band: 14, gain: -0.25 }
				];
				thing
					.setDescription("**The filter is now set to `soft`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "soft";
			} else {
				thing
					.setDescription("**Unknown Filter**")
					.setColor(process.env.REDHEX);
			}
			return interaction.editReply({ embeds: [thing] });
		}
	}
};
