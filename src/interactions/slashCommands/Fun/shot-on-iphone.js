const { default: axios } = require("axios");
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
	name: "shot",
	description: "Fetches a random Shot On Iphone meme",
	type: "CHAT_INPUT",
	options: [
		{
			name: "on",
			description: "Fetches a random Shot On Iphone meme",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "iphone",
					description: "Fetches a random Shot On Iphone meme",
					type: "SUB_COMMAND"
				}
			]
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

		if (!interaction.options.getSubcommandGroup() == "on") return;
		if (!interaction.options.getSubcommand() == "iphone") return;

		let { data } = await axios
			.get(`https://shot-on-iphone.studio/api/video`)
			.catch(() => {});

		interaction.editReply({
			content: data?.url
		});
	}
};
