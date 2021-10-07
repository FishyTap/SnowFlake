const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "slowmode",
	description: "Changes the slowmode time in a specific channel",
	type: "CHAT_INPUT",
	options: [
		{
			name: "time",
			description: "the new slowmode time",
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

		try {
			let time = interaction.options.getString("time");

			const channel = interaction.channel;

			if (!time) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You must state a new slowmode time**"
							)
					]
				});
			}

			let raw = ms(time);

			if (isNaN(raw)) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Invalid Value**")
					]
				});
			}

			if (raw < 0) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**Slowmode time can't be lower than \`${pMs(
									0,
									{
										verbose: true
									}
								)}\`**`
							)
					]
				});
			}

			if (raw > 21600000) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**Slowmode time can't be higher than \`${pMs(
									21600000,
									{ verbose: true }
								)}\`**`
							)
					]
				});
			}

			channel.setRateLimitPerUser(raw / 1000);

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**The slowmode for this channel has been changed to \`${pMs(
								raw,
								{ verbose: true }
							)}\`**`
						)
				]
			});
		} catch {
			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}
	}
};
