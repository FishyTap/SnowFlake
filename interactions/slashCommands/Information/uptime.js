const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "uptime",
	description: "Shows the uptime of the client",
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

		let seconds = Math.floor(interaction.client.uptime / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		let days = Math.floor(hours / 24);

		seconds %= 60;
		minutes %= 60;
		hours %= 24;

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						`**Uptime : \`${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds\`**`
					)
			]
		});
	}
};
