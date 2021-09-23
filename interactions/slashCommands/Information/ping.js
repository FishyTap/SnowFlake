const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "ping",
	description: "🏓 Pong!",
	type: "CHAT_INPUT",
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {Array} args
	 */
	callbacks: async (client, interaction, args) => {
		await interaction.deferReply({
			ephemeral: true
		});
		interaction
			.followUp({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**🏓 Pong! | Calculating ping...**`)
				]
			})
			.then(async (msg) => {
				setTimeout(() => {
					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`**🏓 Pong! | Latency: ${
										msg.createdTimestamp -
										interaction.createdTimestamp
									}ms**`
								)
						]
					});
				}, 3000);
			});
	}
};
