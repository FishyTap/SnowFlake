const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "ping",
	description: "🏓 Pong!",
	type: "CHAT_INPUT",
	cooldown: 10,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let time = Date.now();

		interaction
			.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Calculating ping...**`)
				]
			})
			.then(async () => {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setAuthor(
								"🏓 Pong!",
								client.user.displayAvatarURL({ dynamic: true })
							)
							.addField(
								"**Client Latency**",
								`**\`\`\`ini\n   [ ${
									Date.now() - time
								}ms ]   \`\`\`**`,
								true
							)
							.addField(
								"**API Latency**",
								`**\`\`\`ini\n   [ ${client.ws.ping}ms ]   \`\`\`**`,
								true
							)
					]
				});
			})
			.catch(() => {});
	}
};
