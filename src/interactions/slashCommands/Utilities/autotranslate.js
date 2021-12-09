const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const schema = require("../../../mongo/schemas/guilds");
const { create } = require("../../../mongo/functions/guilds/create");

module.exports = {
	name: "auto",
	description: "Toggles the autoTranslate feature",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "translate",
			description: "Toggles the autoTranslate feature",
			type: "SUB_COMMAND"
		}
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let data = await schema
				.findOne({ guildId: interaction.guild.id })
				.catch(() => {});

			if (!data) data = await create(client, interaction.guild.id);

			if (data.features.autoTranslate == "false") {
				data.features.autoTranslate = "true";
				await data.save();

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**AutoTranslate is now `enabled`**"
							)
					]
				});
			} else if (data.features.autoTranslate == "true") {
				data.features.autoTranslate = "false";
				await data.save();

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**AutoTranslate is now `disabled`**"
							)
					]
				});
			}
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
