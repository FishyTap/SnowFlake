const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "ping",
	description: "🏓 Pong!",
	type: "CHAT_INPUT",
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		interaction
			.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Calculating ping...**`)
				]
			})
			.then(async (msg) => {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle("🏓 Pong!").setDescription(`
								**Client Latency:  \`${
									msg.createdTimestamp -
									interaction.createdTimestamp
								}ms\`**
								**Api Latency:  \`${client.ws.ping}ms\`**
							`)
					]
				});
			})
			.catch(() => {});
	}
};
