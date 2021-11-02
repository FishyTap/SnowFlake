const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
	name: "translate",
	description: "Translate whatever query provided",
	type: "CHAT_INPUT",
	options: [
		{
			name: "query",
			description: "the query you want to translate",
			type: "STRING",
			required: true
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

		const query = interaction.options.getString("query");

		const defaultLanguage = "English";

		const result = await translate(query, {
			to: defaultLanguage
		}).catch(() => {});

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setAuthor(
						interaction.user.tag,
						interaction.user.displayAvatarURL({
							dynamic: true
						})
					)
					.setDescription(`${result?.text}`)
					.setTimestamp()
			]
		});
	}
};
