const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
	name: "djs",
	description: "Fetches a specific discord.js document",
	type: "CHAT_INPUT",
	options: [
		{
			name: "query",
			description: "the documentation you want to search for",
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

		let query = interaction.options.getString("query");

		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
			query
		)}`;

		axios.get(url).then(({ data }) => {
			if (data) {
				interaction.editReply({ embeds: [data] });
			} else {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Unable to fetch anything with the given query**"
							)
					]
				});
			}
		});
	}
};
