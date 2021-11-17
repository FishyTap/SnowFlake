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
		},
		{
			name: "language",
			description: "the language you want to translate to",
			type: "STRING",
			required: false
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
		const language = interaction.options.getString("language");

		let defaultLanguage = "English";
		let result;

		try {
			result = await translate(query, {
				to: language ? language : defaultLanguage.toLowerCase()
			}).catch(() => {});
		} catch (err) {
			console.log(err);
		}

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
					.setDescription(`${result?.text ? result?.text : query}`)
					.setTimestamp()
			]
		});
	}
};
